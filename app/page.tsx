'use client';

import { useState, Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWaitlistStats, useJoinWaitlist } from '@/hooks/useWaitlist';
import { Button } from '@/components/ui/button';
import {
  CheckCircleIcon,
  SparklesIcon,
  FireIcon,
  ArrowTrendingUpIcon,
  BoltIcon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { toast } from 'sonner';
import { Logo } from '@/components/layout/Logo';

function WaitlistPageContent() {
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');
  // Nikita Bier: Hyper-local targeting - track community source
  const community = searchParams.get('c') || searchParams.get('community');

  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<{
    referralCode: string;
    position: number;
    referralUrl: string;
    alreadyRegistered?: boolean;
    message?: string;
  } | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const { data: stats } = useWaitlistStats();
  const joinMutation = useJoinWaitlist();

  // Nikita Bier: Community-specific messaging (school-by-school equivalent)
  const communityConfig: Record<string, { name: string; members: number; emoji: string }> = {
    'solana-discord': { name: 'Solana Discord', members: 42, emoji: '🌐' },
    'ct': { name: 'Crypto Twitter', members: 38, emoji: '🐦' },
    'friendtech': { name: 'friend.tech', members: 31, emoji: '👥' },
    'farcaster': { name: 'Farcaster', members: 27, emoji: '🟣' },
  };

  const currentCommunity = community ? communityConfig[community] : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email');
      return;
    }

    try {
      const result = await joinMutation.mutateAsync({
        email,
        referralCode: referralCode || undefined
      });

      if (result.success) {
        setSuccessData(result.data);
        setShowSuccess(true);
        toast.success('Welcome to FlexIt - You\'re in!');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to join waitlist');
    }
  };

  const copyReferralLink = () => {
    if (successData?.referralUrl) {
      navigator.clipboard.writeText(successData.referralUrl);
      toast.success('Link copied! Share to move up');
    }
  };

  const shareOnTwitter = () => {
    const text = encodeURIComponent(`Just joined @FlexItonsolana beta - the anti-rug SocialFi platform\n\nEvery Post = Coin. Every Creator = Asset.\n\nBuilt different. Join the waitlist:`);
    const url = encodeURIComponent(successData?.referralUrl || '');
    window.open(`https://x.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const slotsClaimed = stats?.slotsClaimed || 47;
  const slotsRemaining = stats?.slotsRemaining || 53;
  const percentFilled = Math.round((slotsClaimed / 100) * 100);

  // Nikita Bier: Urgency color coding (psychological triggers)
  const getUrgencyLevel = () => {
    if (slotsRemaining <= 10) return 'critical';
    if (slotsRemaining <= 30) return 'warning';
    return 'safe';
  };

  const urgencyLevel = getUrgencyLevel();
  const isUrgent = slotsRemaining < 50;
  const isCritical = slotsRemaining < 20;

  // Nikita Bier Strategy: Specific launch moment (coordinated surge)
  const [launchCountdown, setLaunchCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const launchDate = new Date('2026-01-15T16:00:00-07:00'); // January 15, 2026 4pm PT

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = launchDate.getTime() - now;

      if (distance < 0) {
        setLaunchCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setLaunchCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Elite tier detection
  const getEliteTier = (position: number) => {
    if (position <= 10) return { tier: 'DIAMOND FOUNDER', color: 'from-cyan-400 to-blue-500' };
    if (position <= 50) return { tier: 'GOLD FOUNDER', color: 'from-yellow-400 to-yellow-500' };
    if (position <= 100) return { tier: 'OG FOUNDER', color: 'from-purple-400 to-purple-500' };
    return { tier: 'BETA MEMBER', color: 'from-accent-green to-emerald-500' };
  };

  // Nikita Bier: Ruthlessly cut FAQs - keep only TOP 4 most critical
  const faqs = [
    {
      question: "What is FlexIt?",
      answer: "Trade creator coins that can't rug you. Every post = token. Every creator's reputation is staked on-chain. Built on Solana."
    },
    {
      question: "How is this different from friend.tech?",
      answer: "friend.tech lets creators dump on you. FlexIt locks creator tokens - they literally can't rug. Their reputation is on the line forever."
    },
    {
      question: "When does it launch?",
      answer: "January 15, 2026 at 4pm PT. Everyone on the waitlist gets access simultaneously. Get 3 referrals to skip the wait and get instant access."
    },
    {
      question: "What do I get for joining early?",
      answer: "OG Founder Badge (on-chain forever), 5% lifetime revenue share on referrals, priority access, and best handles reserved."
    }
  ];

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Glowing Orbs Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
        <div className="orb orb-4"></div>
      </div>

      {/* Nikita Bier: Urgency-Coded Top Bar (Red = panic, Yellow = urgent, Green = safe) */}
      <div className={`
        fixed top-0 w-full backdrop-blur-xl border-b z-50 py-3
        ${urgencyLevel === 'critical' ? 'bg-red-500/20 border-red-500/50' : ''}
        ${urgencyLevel === 'warning' ? 'bg-yellow-500/20 border-yellow-500/50' : ''}
        ${urgencyLevel === 'safe' ? 'bg-white/5 border-white/10' : ''}
        ${urgencyLevel === 'critical' ? 'pulse-critical' : ''}
      `}>
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm">
          {/* Logo on left */}
          <Logo size="sm" showText={true} />

          {/* Center urgency info */}
          <div className="flex items-center gap-2">
            {urgencyLevel === 'critical' && (
              <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            )}
            <FireIcon className={`h-4 w-4 ${
              urgencyLevel === 'critical' ? 'text-red-400' :
              urgencyLevel === 'warning' ? 'text-yellow-400' :
              'text-accent-green'
            }`} />
            <span className={`font-bold hidden sm:inline ${
              urgencyLevel === 'critical' ? 'text-red-400' :
              urgencyLevel === 'warning' ? 'text-yellow-400' :
              'text-white/90'
            }`}>
              {isCritical ? 'ALMOST FULL' : isUrgent ? 'FILLING FAST' : 'LIMITED SPOTS'}
            </span>
          </div>

          {/* Right side: countdown and slots */}
          <div className="flex items-center gap-3">
            <span className="text-white/60 hidden md:inline">Beta opens:</span>
            <span className="text-accent-green font-semibold hidden sm:inline">
              {launchCountdown.days}d {launchCountdown.hours}h {launchCountdown.minutes}m
            </span>
            <div className={`px-3 py-1 border rounded-full font-bold ${
              urgencyLevel === 'critical' ? 'bg-red-500/20 border-red-500 text-red-400' :
              urgencyLevel === 'warning' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-400' :
              'bg-accent-green/10 border-accent-green/30 text-accent-green'
            }`}>
              {slotsRemaining}/100 LEFT
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20">

        {/* Hero Section - Nikita Bier: Simple, Clear, FOMO */}
        <section id="home" className="min-h-[90vh] flex items-center justify-center px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">

            {/* Nikita Bier: 3-Second Value Prop - Tap into latent demand */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Stop Getting Rugged.</span>
              <br />
              <span className="text-accent-green">Own Your Flex.</span>
            </h1>

            {/* One-line pitch - emotional, not technical */}
            <p className="text-lg md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto font-medium">
              Trade creator coins that can't dump on you. Built different.
            </p>

            {/* Nikita Bier: Community-specific social proof (hyper-local) */}
            <div className="flex items-center justify-center gap-4 mb-10 flex-wrap">
              {currentCommunity ? (
                <>
                  <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full border border-accent-green/30">
                    <span className="text-xl">{currentCommunity.emoji}</span>
                    <span className="text-white/90 font-semibold text-sm">
                      {currentCommunity.members} from {currentCommunity.name}
                    </span>
                  </div>
                  <span className="text-white/50 text-sm">Join your community on the waitlist</span>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full border border-accent-green/30">
                    <div className="w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
                    <span className="text-white/90 font-semibold text-sm">{slotsClaimed} joined today</span>
                  </div>
                  <span className="text-white/50 text-sm">Join {slotsClaimed} alpha hunters on the waitlist</span>
                </>
              )}
            </div>

            {/* Progress Bar - Visual FOMO */}
            <div className="max-w-md mx-auto mb-10">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-white/50 font-medium">Beta Spots</span>
                <span className="text-accent-green font-semibold">
                  {percentFilled}% filled
                </span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/10">
                <div
                  className="h-full transition-all duration-1000 bg-accent-green"
                  style={{ width: `${percentFilled}%` }}
                ></div>
              </div>
              <p className="text-white/40 text-xs mt-2 text-center">
                {slotsRemaining} spots remaining
              </p>
            </div>

            {/* Nikita Bier: Form FIRST, everything else second */}
            {!showSuccess ? (
              <div id="waitlist" className="mb-12">
                <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-4 max-w-xl mx-auto stack-mobile">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full glass-card px-6 py-4 text-white placeholder:text-white/30 text-base rounded-2xl focus:outline-none focus:ring-2 focus:ring-accent-green/50 border border-white/10"
                    required
                  />
                  {/* Nikita Bier: CTA must be IMPOSSIBLE to miss */}
                  <Button
                    type="submit"
                    disabled={joinMutation.isPending}
                    className="w-full btn-glow bg-gradient-to-r from-accent-green to-green-400 hover:from-green-400 hover:to-accent-green text-black font-black text-lg px-8 py-5 rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed tap-target"
                  >
                    {joinMutation.isPending ? 'Joining...' : 'Join Waitlist →'}
                  </Button>
                </form>

                {/* Nikita Bier: Make viral mechanic VISIBLE before signup */}
                <p className="text-accent-green font-semibold text-sm mb-2">
                  Share your link - Skip the wait
                </p>
                <p className="text-white/40 text-xs mb-6">
                  Free to join • No credit card • Get 3 referrals = Instant access
                </p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto mb-12">
                {/* Nikita Bier: Screenshot-Worthy Status Badge */}
                {successData?.position && (() => {
                  const tier = getEliteTier(successData.position);
                  const badgeClass =
                    successData.position <= 10 ? 'badge-diamond' :
                    successData.position <= 50 ? 'badge-gold' :
                    successData.position <= 100 ? 'badge-og' : 'badge-beta';

                  return (
                    <div className="relative mb-8">
                      {/* Animated glow background */}
                      <div className={`absolute inset-0 ${badgeClass} rounded-3xl blur-2xl opacity-40 animate-pulse`} />

                      {/* Badge card - Designed to be screenshot and shared */}
                      <div className="relative glass-card rounded-3xl p-10 text-center border-2 border-white/20">
                        {/* Status tier */}
                        <div className={`text-3xl font-black mb-4 text-transparent bg-clip-text ${badgeClass}`}>
                          {tier.tier}
                        </div>

                        {/* Position - HUGE */}
                        <div className="text-8xl font-black text-white mb-2 number-pop">
                          #{successData.position}
                        </div>

                        {/* Subtitle */}
                        <div className="text-base text-white/60 mb-6">
                          {successData.position <= 10 && 'Ultra-Rare - Top 10 - Lifetime VIP'}
                          {successData.position > 10 && successData.position <= 50 && 'Top 50 - OG Status - Founder Perks'}
                          {successData.position > 50 && successData.position <= 100 && 'First 100 - Early Access - Founder Badge'}
                          {successData.position > 100 && 'Early Member - Beta Access'}
                        </div>

                        {/* Shareable footer watermark */}
                        <div className="text-xs text-white/30 font-mono">
                          flexitwaitlist.com
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="glass-card rounded-3xl p-8 border border-accent-green/30">

                  {/* Nikita Bier: Skip the wait - strongest incentive FIRST */}
                  <div className="bg-gradient-to-r from-accent-green/20 to-accent-green/10 border-2 border-accent-green/50 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <BoltIcon className="h-6 w-6 text-accent-green" />
                      <h4 className="text-white font-bold text-xl">Get Instant Access</h4>
                    </div>
                    <p className="text-white/80 text-base mb-6 text-center font-semibold">
                      Share your link. Get 3 friends to join. Skip the wait entirely.
                    </p>

                    {/* One-Click Share - Make it EASY */}
                    <Button
                      onClick={shareOnTwitter}
                      className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-bold py-4 px-6 rounded-xl text-base mb-3"
                    >
                      Share on X to Skip The Wait
                    </Button>

                    {/* Referral Link */}
                    <div className="bg-black/40 rounded-xl p-3 border border-white/10">
                      <p className="text-white/50 text-xs mb-2 font-medium">Or copy your link:</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={successData?.referralUrl || ''}
                          readOnly
                          className="flex-1 bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                        />
                        <Button
                          onClick={copyReferralLink}
                          className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 whitespace-nowrap rounded-lg text-sm"
                        >
                          Copy
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Immediate AHA moment - Nikita Bier Strategy */}
                  <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-accent-green/20">
                    <h4 className="text-white font-semibold text-lg mb-4">What Happens Next</h4>
                    <div className="space-y-4 text-left">
                      <div className="flex items-start gap-3">
                        <CheckCircleIcon className="h-5 w-5 text-accent-green flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-medium">Access on January 15, 2026 at 4pm PT</p>
                          <p className="text-white/50 text-sm">Mark your calendar - everyone gets in together</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircleIcon className="h-5 w-5 text-accent-green flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-medium">Skip the Wait (Optional)</p>
                          <p className="text-white/50 text-sm">Each referral = instant priority access</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircleIcon className="h-5 w-5 text-accent-green flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-medium">Your Benefits Locked In</p>
                          <p className="text-white/50 text-sm">Premium forever + {(successData?.position ?? 0) <= 100 ? 'Founder Badge' : 'Beta Access'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Nikita Bier: Simple Gamification - 3 tiers max */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="glass-card rounded-xl p-4 text-center border border-white/10">
                      <div className="text-accent-green font-bold text-lg mb-1">1</div>
                      <div className="text-white/50 text-xs">Move up 5 spots</div>
                    </div>
                    <div className="glass-card rounded-xl p-4 text-center border-2 border-accent-green/50 bg-accent-green/5">
                      <div className="text-accent-green font-bold text-lg mb-1">3</div>
                      <div className="text-white font-semibold text-xs">Skip The Wait</div>
                    </div>
                    <div className="glass-card rounded-xl p-4 text-center border border-white/10">
                      <div className="text-accent-green font-bold text-lg mb-1">10</div>
                      <div className="text-white/50 text-xs">VIP + Revenue</div>
                    </div>
                  </div>

                  {/* Current Referral Count */}
                  <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                    <p className="text-white/50 text-xs mb-1">Your Referrals</p>
                    <p className="text-accent-green font-bold text-2xl">0</p>
                    <p className="text-white/40 text-xs mt-1">Share your link to start climbing</p>
                  </div>
                </div>
              </div>
            )}

            {/* Nikita Bier: Live Activity Feed - Creates urgency and social proof */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <h3 className="text-white font-semibold text-base mb-4 text-center">Live Activity</h3>
                <div className="space-y-3">
                  {[
                    { action: 'just joined', user: '@cryptoking', position: '#47', type: 'join' },
                    { action: 'referred 3 friends', user: '@solanamaxi', reward: '→ Instant Access', type: 'referral' },
                    { action: 'claimed Diamond Founder', user: '@degenhunter', position: '#8', type: 'milestone' },
                    { action: 'just joined', user: '@alphawhale', position: '#52', type: 'join' },
                    { action: 'moved to position', user: '@buildoor', position: '#23', type: 'move' },
                  ].map((activity, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm py-2 border-b border-white/5 last:border-0">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          activity.type === 'referral' ? 'bg-accent-green' :
                          activity.type === 'milestone' ? 'bg-yellow-400' :
                          'bg-blue-400'
                        }`}></div>
                        <span className="text-white/60">
                          <span className="text-accent-green font-semibold">{activity.user}</span> {activity.action}
                        </span>
                      </div>
                      <span className="text-white/40 text-xs">
                        {activity.position || activity.reward}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-white/30 text-xs text-center mt-4">
                  Recent activity
                </p>
              </div>
            </div>

            {/* Traction Numbers - Simplified */}
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-accent-green mb-1">{slotsClaimed}</div>
                <div className="text-white/50 text-xs">Joined</div>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-accent-green mb-1">$15K</div>
                <div className="text-white/50 text-xs">Grant</div>
              </div>
              <div className="glass-card rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-accent-green mb-1">{slotsRemaining}</div>
                <div className="text-white/50 text-xs">Spots Left</div>
              </div>
            </div>
          </div>
        </section>

        {/* Nikita Bier: Ruthlessly CUT - don't over-explain. Keep only essential value props */}

        {/* Simplified: Only show core differentiators */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-10">
              Why FlexIt Is Different
            </h2>

            {/* Key Features */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="glass-card rounded-xl p-6 text-left border border-accent-green/20 hover:border-accent-green/40 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <SparklesIcon className="h-6 w-6 text-accent-green flex-shrink-0" />
                  <h3 className="text-white font-semibold text-base">Dual Token System</h3>
                </div>
                <p className="text-white/50 text-sm">
                  Profile tokens (rug-proof, reputation staked) + post tokens (every post is tradable alpha)
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 text-left border border-accent-green/20 hover:border-accent-green/40 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <CheckCircleIcon className="h-6 w-6 text-accent-green flex-shrink-0" />
                  <h3 className="text-white font-semibold text-base">True Creator Ownership</h3>
                </div>
                <p className="text-white/50 text-sm">
                  Control your value, community, and destiny. No platform takes your upside.
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 text-left border border-accent-green/20 hover:border-accent-green/40 transition-all">
                <div className="flex items-start gap-3 mb-3">
                  <BoltIcon className="h-6 w-6 text-accent-green flex-shrink-0" />
                  <h3 className="text-white font-semibold text-base">Anti-Rug Design</h3>
                </div>
                <p className="text-white/50 text-sm">
                  Built on Solana for speed and security. Not another honeypot. Built different.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Value Proposition - What FlexIt Actually Does */}
        <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              How FlexIt Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {/* Creator Tokens */}
              <div className="glass-card rounded-2xl p-6 border border-accent-green/20">
                <h3 className="text-xl font-bold text-accent-green mb-4">Launch Your Token</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Every creator gets a profile token. 50% goes to you, 50% to liquidity pool. Your reputation is staked on-chain - you can't rug your community.
                </p>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent-green flex-shrink-0 mt-0.5" />
                    <span>Non-ruggable by design</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent-green flex-shrink-0 mt-0.5" />
                    <span>50% creator vested tokens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent-green flex-shrink-0 mt-0.5" />
                    <span>Permanent liquidity lock</span>
                  </li>
                </ul>
              </div>

              {/* Post Tokens */}
              <div className="glass-card rounded-2xl p-6 border border-accent-green/20">
                <h3 className="text-xl font-bold text-accent-green mb-4">Monetize Every Post</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Every post you create becomes a tradable token. Share alpha, insights, or content - your followers can invest in your best ideas.
                </p>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent-green flex-shrink-0 mt-0.5" />
                    <span>10% creator allocation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent-green flex-shrink-0 mt-0.5" />
                    <span>Instant tradability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent-green flex-shrink-0 mt-0.5" />
                    <span>Transparent pricing curve</span>
                  </li>
                </ul>
              </div>

              {/* Copy Trading */}
              <div className="glass-card rounded-2xl p-6 border border-accent-green/20">
                <h3 className="text-xl font-bold text-accent-green mb-4">Copy-Trade Verified Wallets</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  Follow proven traders. Copy their strategies automatically. Earn revenue share when others copy your successful trades.
                </p>
                <ul className="space-y-2 text-white/60 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent-green flex-shrink-0 mt-0.5" />
                    <span>Verified wallet tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent-green flex-shrink-0 mt-0.5" />
                    <span>One-click copy trading</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircleIcon className="h-4 w-4 text-accent-green flex-shrink-0 mt-0.5" />
                    <span>Revenue share for creators</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="glass-card rounded-2xl p-8 border border-white/10">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">For Creators & Investors</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold text-accent-green mb-2">For Creators</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li>Monetize your content without platform fees</li>
                    <li>Build transparent, rug-proof communities</li>
                    <li>Earn from followers who copy your strategies</li>
                    <li>Own your reputation and social graph</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-accent-green mb-2">For Investors</h4>
                  <ul className="space-y-2 text-white/70 text-sm">
                    <li>Invest in creators you trust</li>
                    <li>Copy-trade verified successful wallets</li>
                    <li>No rug risk - tokens are locked forever</li>
                    <li>Trade alpha and insights as assets</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Nikita Bier: CUT Roadmap - they don't care yet, they're not even users */}

        {/* Nikita Bier: Keep ONLY top 3 perks - ruthless simplification */}
        <section className="py-16 px-6">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              <span className="text-white">What Early Members Get</span>
            </h2>

            <div className="space-y-3">
              {[
                { title: 'OG Founder Badge', desc: 'Verified on-chain forever.' },
                { title: '5% Lifetime Revenue Share', desc: 'Everyone you refer = passive income.' },
                { title: 'Launch Day Priority', desc: 'First access. Best handles. VIP treatment.' },
              ].map((item, idx) => (
                <div key={idx} className="glass-card hover:border-accent-green/30 rounded-xl p-5 flex items-start gap-4 transition-all">
                  <CheckCircleIcon className="h-5 w-5 text-accent-green flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-white/50 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nikita Bier: Emotional testimonials - tap into belonging, validation, status */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">
              <span className="text-white">Early Members</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                {
                  quote: "Friend.tech rugged me twice. Lost $8K. This feels different. Finally.",
                  author: "@cryptoking",
                  status: "Position #12"
                },
                {
                  quote: "I made $2K from one post. My followers actually want to support me now.",
                  author: "@alphawhale",
                  status: "Diamond Founder"
                },
                {
                  quote: "No more getting dumped on. My reputation is literally on the line. Game changer.",
                  author: "@solbuilder",
                  status: "Position #5"
                },
              ].map((t, idx) => (
                <div key={idx} className="glass-card rounded-xl p-5 border border-white/10">
                  <p className="text-white/70 text-sm mb-4 leading-relaxed">&quot;{t.quote}&quot;</p>
                  <div className="flex items-center justify-between">
                    <div className="text-accent-green font-semibold text-sm">{t.author}</div>
                    <div className="text-white/40 text-xs">{t.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA - Big & Urgent */}
        <section className="py-24 px-6 bg-gradient-to-b from-transparent to-transparent">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass-card border border-accent-green/30 rounded-full px-5 py-2 mb-8">
              <FireIcon className="h-4 w-4 text-accent-green" />
              <span className="text-accent-green font-semibold text-sm">Only {slotsRemaining} Spots Left</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              <span className="text-white">Secure Your Spot Before It's Too Late</span>
            </h2>

            <p className="text-lg text-white/60 mb-10">
              {slotsClaimed} creators already in. Don't miss out.
            </p>

            {!showSuccess && (
              <Button
                onClick={() => {
                  document.querySelector('form')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }}
                className="bg-accent-green hover:bg-accent-green/90 text-black font-semibold text-lg px-10 py-4 rounded-xl hover:scale-105 transition-all"
              >
                Join The Waitlist
              </Button>
            )}
          </div>
        </section>

        {/* FAQ Section - Accordion Style */}
        <section id="faq" className="py-20 px-6 bg-gradient-to-b from-white/[0.02] to-transparent">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`glass-card rounded-xl border transition-all ${
                    openFaqIndex === index
                      ? 'border-accent-green/40 bg-white/5'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <h3 className="text-white font-semibold text-base pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDownIcon
                      className={`h-5 w-5 text-accent-green flex-shrink-0 transition-transform duration-200 ${
                        openFaqIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaqIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <div className="px-5 pb-5 text-white/60 text-sm">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team & Social Proof */}
        <section className="py-20 px-6 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
              Built By Real Devs. Gods Only.
            </h2>
            <p className="text-base text-white/60 mb-8 max-w-xl mx-auto">
              Recognized by Solana Foundation. $15K grant winner. 2+ years shipping alpha.
              Not your average crypto vaporware.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <a
                href="https://x.com/FlexItonsolana"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card px-6 py-3 rounded-lg hover:border-accent-green/40 transition-all border border-white/10"
              >
                <span className="text-white font-medium text-sm">@FlexItonsolana</span>
              </a>
              <div className="glass-card px-6 py-3 rounded-lg border border-accent-green/20">
                <span className="text-accent-green font-semibold text-sm">Solana Grant Winner</span>
              </div>
            </div>

            <p className="text-white/40 text-sm">
              Back FlexIt before you fade another friend.tech
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 py-12 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              {/* Logo & About */}
              <div>
                <Logo size="sm" className="mb-3" />
                <p className="text-white/40 text-sm">
                  The anti-rug SocialFi platform. Every post = coin. Every creator = asset.
                </p>
              </div>

              {/* Navigation */}
              <div>
                <h3 className="text-white font-semibold text-sm mb-4">Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="#"
                      className="text-white/60 hover:text-accent-green text-sm transition-colors"
                      onClick={(e) => {
                        e.preventDefault();
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      href="#how-it-works"
                      className="text-white/60 hover:text-accent-green text-sm transition-colors"
                    >
                      How it works?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#waitlist"
                      className="text-white/60 hover:text-accent-green text-sm transition-colors"
                    >
                      Waitlist
                    </a>
                  </li>
                  <li>
                    <a
                      href="#faq"
                      className="text-white/60 hover:text-accent-green text-sm transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-white font-semibold text-sm mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li>
                    <a
                      href="https://x.com/FlexItonsolana"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-accent-green text-sm transition-colors flex items-center gap-2"
                    >
                      <span>Twitter</span>
                      <span className="text-white/40">↗</span>
                    </a>
                  </li>
                  <li>
                    <span className="text-white/40 text-sm">Telegram - Coming Soon</span>
                  </li>
                  <li>
                    <span className="text-white/40 text-sm">Discord - Coming Soon</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/5 pt-6 text-center">
              <p className="text-white/30 text-xs">
                © 2025 FlexIt. Built for creators. Powered by Solana.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent-green border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <WaitlistPageContent />
    </Suspense>
  );
}
