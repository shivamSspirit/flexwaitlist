import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/server';
import { WAITLIST_CONFIG } from '@/lib/supabase/config';
import type { JoinWaitlistRequest } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * POST /api/waitlist/join
 *
 * Join the waitlist with viral referral mechanics
 * Nikita Bier Strategy: Make it easy to join, hard to ignore referrals
 */
export async function POST(request: NextRequest) {
  try {
    const body: JoinWaitlistRequest = await request.json();
    const { email, referralCode } = body;

    // Validate email
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json({
        success: false,
        error: 'Valid email is required',
      }, { status: 400 });
    }

    console.log('🎯 [WAITLIST] New signup:', { email, referralCode });

    // Generate unique referral code
    const newReferralCode = generateReferralCode();

    // Check if email already exists
    const { data: existing } = await supabaseAdmin
      .from('waitlist_signups')
      .select('id, email, referral_code, position')
      .eq('email', email)
      .single();

    if (existing) {
      console.log('⚠️ [WAITLIST] Email already registered:', email);
      return NextResponse.json({
        success: true,
        data: {
          alreadyRegistered: true,
          referralCode: existing.referral_code,
          position: existing.position || 0,
          message: 'You\'re already on the list!',
          referralUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.flexitsol.fun'}/?ref=${existing.referral_code}`,
        },
      });
    }

    // Validate referral code if provided
    let referredBy = null;
    if (referralCode) {
      const { data: referrer } = await supabaseAdmin
        .from('waitlist_signups')
        .select('referral_code')
        .eq('referral_code', referralCode.toUpperCase())
        .single();

      if (referrer) {
        referredBy = referralCode.toUpperCase();
        console.log('✅ [WAITLIST] Valid referral code:', referredBy);
      }
    }

    // Insert new signup
    const { data: signup, error } = await supabaseAdmin
      .from('waitlist_signups')
      .insert({
        email: email.toLowerCase(),
        referral_code: newReferralCode,
        referred_by: referredBy,
      })
      .select()
      .single();

    if (error) {
      console.error('❌ [WAITLIST] Insert error:', error);
      return NextResponse.json({
        success: false,
        error: 'Failed to join waitlist',
      }, { status: 500 });
    }

    // Calculate position in queue
    const { count } = await supabaseAdmin
      .from('waitlist_signups')
      .select('id', { count: 'exact', head: true });

    const position = count || 1;

    // Update position
    await supabaseAdmin
      .from('waitlist_signups')
      .update({ position })
      .eq('id', signup.id);

    console.log('🎉 [WAITLIST] Signup successful:', {
      email,
      referralCode: newReferralCode,
      position,
    });

    const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.flexitsol.fun'}/?ref=${newReferralCode}`;

    // Email sending disabled - contact users later from database
    console.log('📧 [EMAIL] Skipping welcome email - signup saved for later contact');

    return NextResponse.json({
      success: true,
      data: {
        referralCode: newReferralCode,
        position,
        referralUrl,
        message: 'You\'re on the list! We\'ll contact you soon.',
      },
    });

  } catch (error) {
    console.error('❌ [WAITLIST] Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json({
      success: false,
      error: errorMessage,
    }, { status: 500 });
  }
}

/**
 * GET /api/waitlist/join
 *
 * Get waitlist stats
 */
export async function GET() {
  try {
    // Get total signups
    const { count } = await supabaseAdmin
      .from('waitlist_signups')
      .select('id', { count: 'exact', head: true });

    const totalSignups = count || 0;
    const betaSlots = WAITLIST_CONFIG.betaSlots;
    const slotsRemaining = Math.max(0, betaSlots - totalSignups);

    return NextResponse.json({
      success: true,
      data: {
        totalSignups,
        betaSlots,
        slotsRemaining,
        slotsClaimed: totalSignups,
        percentageFilled: Math.min(100, Math.round((totalSignups / betaSlots) * 100)),
      },
    });

  } catch (error) {
    console.error('❌ [WAITLIST] Stats error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch stats',
    }, { status: 500 });
  }
}

/**
 * Generate a unique referral code
 * Uses alphanumeric characters excluding confusing ones (0, O, 1, I, L)
 */
function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < WAITLIST_CONFIG.referralCodeLength; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}
