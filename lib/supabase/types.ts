/**
 * Database types for type-safe Supabase operations
 */

export interface WaitlistSignup {
  id: string;
  email: string;
  referral_code: string;
  referred_by: string | null;
  referral_count: number;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface WaitlistStats {
  totalSignups: number;
  betaSlots: number;
  slotsRemaining: number;
  percentageFilled: number;
}

export interface JoinWaitlistRequest {
  email: string;
  referralCode?: string;
  metadata?: Record<string, unknown>;
}

export interface JoinWaitlistResponse {
  success: boolean;
  referralCode: string;
  position: number;
  referralUrl: string;
  message?: string;
}
