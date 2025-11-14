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

  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const { data: stats } = useWaitlistStats();
  const joinMutation = useJoinWaitlist();

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
    const text = encodeURIComponent(`Just joined @FlexIt beta - the anti-rug SocialFi platform\n\nEvery Post = Coin. Every Creator = Asset.\n\nBuilt different. Join the waitlist:`);
    const url = encodeURIComponent(successData?.referralUrl || '');
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const slotsClaimed = stats?.slotsClaimed || 47;
  const slotsRemaining = stats?.slotsRemaining || 53;
  const percentFilled = Math.round((slotsClaimed / 100) * 100);

  // Nikita Bier Strategy: Show urgency when < 50 spots left
  const isUrgent = slotsRemaining < 50;
  const isCritical = slotsRemaining < 20;

  // Nikita Bier Strategy: Specific launch moment (coordinated surge)
  const [launchCountdown, setLaunchCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const launchDate = new Date('2025-03-15T16:00:00-07:00'); // March 15, 4pm PT

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

  // FAQ data
  const faqs = [
    {
      question: "What is FlexIt?",
      answer: "FlexIt is a next-gen SocialFi platform on Solana where every post becomes a tradable coin and every creator is an asset. Built to empower creators, alpha hunters, and degens with real ownership, trust, and liquidity."
    },
    {
      question: "How is FlexIt different from friend.tech?",
      answer: "FlexIt isn't a clone. It's an anti-rug platform built on Solana with a dual token system, battle-tested tokenomics, and features designed for sustainable creator economies. No rugs, just real value."
    },
    {
      question: "How does the dual token system work?",
      answer: (
        <span>
          <span className="text-white font-medium">Profile Tokens:</span> One per creator. 50% vested to creator, 50% to liquidity. Fully non-ruggable with reputation staked on-chain.<br /><br />
          <span className="text-white font-medium">Post Tokens:</span> Every post creates a coin. Creators get 10%, market gets 90%. Every idea becomes tradable alpha.
        </span>
      )
    },
    {
      question: "Who is FlexIt for?",
      answer: (
        <span>
          <span className="text-accent-green">Alpha hunters</span> seeking proven signals and private wallet access. <span className="text-accent-green">Degen traders</span> who want verified strategies to copy. <span className="text-accent-green">Creator kings</span> building unified monetization and reputation without platform fragmentation.
        </span>
      )
    },
    {
      question: "What problem does FlexIt solve?",
      answer: "The creator economy is broken. Platform fragmentation, constant rug pulls, and empty promises keep most creators earning under $20K/year. FlexIt makes content liquid, eliminates rug risks, and delivers transparent value to both creators and followers."
    },
    {
      question: "What makes FlexIt rug-proof?",
      answer: "Profile tokens have zero exit loopholes. Creators stake their reputation, so nobody can rug and run. Post tokens use transparent vesting and liquidity rules that protect both creators and their communities."
    },
    {
      question: "What's on the roadmap?",
      answer: (
        <span>
          <span className="text-accent-green">Q4 2025:</span> Creator tokens launch<br />
          <span className="text-accent-green">Q1 2026:</span> Copy-trading goes live<br />
          <span className="text-accent-green">Q2 2026:</span> Privacy mode + DAO governance<br />
          <span className="text-accent-green">Q3-Q4 2026:</span> Multi-chain expansion (Ethereum, Base)
        </span>
      )
    },
    {
      question: "Why Solana?",
      answer: "Solana delivers unmatched speed and near-zero transaction costs. Perfect for real-time trading, instant settlements, and the scale SocialFi demands. Built for speed, not slow chains."
    },
    {
      question: "Who's building FlexIt?",
      answer: "Real Solana devs, not LARPers. Recognized by Solana Foundation with a $15K grant. Track record of shipping products, leading communities, and staying transparent. No anon founders, no vaporware."
    },
    {
      question: "How do I join?",
      answer: "Sign up for early access on the waitlist. Share your link to climb the ranks. Follow us on X (@ShivamSspirit), join our Telegram, or hop into Discord. Don't fade the next wave of creator tokenization."
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

      {/* Sticky Top Bar - FOMO with Real Countdown */}
      <div className="fixed top-0 w-full bg-white/5 backdrop-blur-xl border-b border-white/10 z-50 py-3">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <FireIcon className="h-4 w-4 text-accent-green" />
            <span className="text-white/90 font-semibold">
              {isCritical ? 'ALMOST FULL' : isUrgent ? 'FILLING FAST' : 'LIMITED SPOTS'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/60 hidden sm:inline">Beta opens:</span>
            <span className="text-accent-green font-semibold">
              {launchCountdown.days}d {launchCountdown.hours}h {launchCountdown.minutes}m {launchCountdown.seconds}s
            </span>
            <div className="px-3 py-1 bg-accent-green/10 border border-accent-green/30 rounded-full">
              <span className="text-accent-green font-semibold">{slotsRemaining}/100 LEFT</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-20">

        {/* Hero Section - Nikita Bier: Simple, Clear, FOMO */}
        <section id="home" className="min-h-[90vh] flex items-center justify-center px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">

            {/* Headline - FlexIt Specific */}
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              <span className="text-white">FlexIt: Every Post = Coin.</span>
              <br />
              <span className="text-accent-green">Every Creator = Asset.</span>
            </h1>

            {/* Elevator Pitch */}
            <p className="text-base md:text-lg text-white/70 mb-3 max-w-2xl mx-auto font-medium">
              Join the anti-rug SocialFi revolution. Built different.
            </p>

            {/* Subheadline - Social Proof */}
            <p className="text-sm md:text-base text-white/50 mb-10 max-w-2xl mx-auto">
              {slotsClaimed} alpha hunters already on the waitlist
            </p>

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

            {/* Form or Success */}
            {!showSuccess ? (
              <div id="waitlist" className="mb-12">
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 mb-6 max-w-xl mx-auto">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 glass-card px-6 py-4 text-white placeholder:text-white/30 text-base rounded-2xl focus:outline-none focus:border-accent-green/50 border border-white/10"
                    required
                  />
                  <Button
                    type="submit"
                    disabled={joinMutation.isPending}
                    className="bg-accent-green hover:bg-accent-green/90 text-black font-semibold text-base px-8 py-4 rounded-xl hover:scale-105 transition-all disabled:opacity-50 h-auto whitespace-nowrap"
                  >
                    {joinMutation.isPending ? 'Joining...' : 'Join Waitlist'}
                  </Button>
                </form>

                <p className="text-white/40 text-sm mb-6">
                  Free to join • No credit card • Instant access
                </p>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto mb-12">
                <div className="glass-card rounded-3xl p-8 border border-accent-green/30">
                  {/* Elite Tier Badge */}
                  {successData?.position && (() => {
                    const tier = getEliteTier(successData.position);
                    return (
                      <div className={`inline-block bg-gradient-to-r ${tier.color} px-6 py-2 rounded-full mb-6`}>
                        <span className="text-white font-semibold text-sm">
                          {tier.tier}
                        </span>
                      </div>
                    );
                  })()}

                  <h3 className="text-3xl font-bold text-white mb-3">You're on the list!</h3>
                  <p className="text-white/60 mb-2 text-base">
                    Position: <span className="text-accent-green font-bold text-2xl">#{successData?.position}</span> of 100
                  </p>
                  <p className="text-white/40 text-sm mb-8">
                    {successData?.position <= 10 && 'Ultra-rare Diamond Founder status unlocked'}
                    {successData?.position > 10 && successData?.position <= 50 && 'Gold Founder status unlocked'}
                    {successData?.position > 50 && successData?.position <= 100 && 'OG Founder status unlocked'}
                    {successData?.position > 100 && 'Beta Member status unlocked'}
                  </p>

                  {/* Immediate AHA moment - Nikita Bier Strategy */}
                  <div className="bg-white/5 rounded-2xl p-6 mb-6 border border-accent-green/20">
                    <h4 className="text-white font-semibold text-lg mb-4">What Happens Next</h4>
                    <div className="space-y-4 text-left">
                      <div className="flex items-start gap-3">
                        <CheckCircleIcon className="h-5 w-5 text-accent-green flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-white font-medium">Access on March 15 at 4pm PT</p>
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
                          <p className="text-white/50 text-sm">Premium forever + {successData?.position <= 100 ? 'Founder Badge' : 'Beta Access'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Viral Share Section - CRITICAL for Nikita Bier Strategy */}
                  <div className="bg-accent-green/10 border border-accent-green/30 rounded-2xl p-6 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <ArrowTrendingUpIcon className="h-5 w-5 text-accent-green" />
                      <h4 className="text-white font-semibold text-base">Skip The Wait</h4>
                    </div>
                    <p className="text-white/60 text-sm mb-6 text-center">
                      Share your referral link. Each signup moves you up the list.
                    </p>

                    {/* Referral Link */}
                    <div className="bg-white/5 rounded-xl p-4 mb-4 border border-white/10">
                      <p className="text-white/50 text-xs mb-2 font-medium uppercase tracking-wider">Your Link</p>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={successData?.referralUrl || ''}
                          readOnly
                          className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white text-sm font-mono"
                        />
                        <Button
                          onClick={copyReferralLink}
                          className="bg-white/10 hover:bg-white/20 text-white font-semibold px-4 whitespace-nowrap rounded-lg text-sm"
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    {/* One-Click Share - Make it EASY */}
                    <Button
                      onClick={shareOnTwitter}
                      className="w-full bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white font-semibold py-3 px-6 rounded-lg text-sm"
                    >
                      Share on X to Move Up
                    </Button>
                  </div>

                  {/* Gamified Rewards - Nikita Bier Strategy */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="glass-card rounded-xl p-4 text-center">
                      <div className="text-accent-green font-semibold text-base mb-1">1 ref</div>
                      <div className="text-white/50 text-xs">+3 spots</div>
                    </div>
                    <div className="glass-card rounded-xl p-4 text-center border border-accent-green/30">
                      <div className="text-accent-green font-semibold text-base mb-1">3 refs</div>
                      <div className="text-white/50 text-xs">Founder Badge</div>
                    </div>
                    <div className="glass-card rounded-xl p-4 text-center">
                      <div className="text-accent-green font-semibold text-base mb-1">10 refs</div>
                      <div className="text-white/50 text-xs">VIP Access</div>
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

            {/* Traction Numbers */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto">
              <div className="glass-card rounded-lg p-4">
                <div className="text-2xl font-bold text-accent-green mb-1">100+</div>
                <div className="text-white/50 text-xs">OG Creators</div>
              </div>
              <div className="glass-card rounded-lg p-4">
                <div className="text-2xl font-bold text-accent-green mb-1">$15K</div>
                <div className="text-white/50 text-xs">Solana Grant</div>
              </div>
              <div className="glass-card rounded-lg p-4">
                <div className="text-2xl font-bold text-accent-green mb-1">2+yrs</div>
                <div className="text-white/50 text-xs">Shipping Alpha</div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 px-6 bg-gradient-to-b from-transparent to-white/[0.02]">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
              How FlexIt Works
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent-green font-bold text-2xl">1</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Create Your Profile</h3>
                <p className="text-white/60 text-sm">
                  Launch your creator token. Your reputation becomes liquid and tradable.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent-green font-bold text-2xl">2</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Post & Earn</h3>
                <p className="text-white/60 text-sm">
                  Every post creates a tradable token. Share alpha, get paid instantly.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent-green font-bold text-2xl">3</span>
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">Build Your Economy</h3>
                <p className="text-white/60 text-sm">
                  Followers copy-trade your moves. You earn from every trade they make.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="py-16 px-6 bg-gradient-to-b from-transparent to-white/[0.02]">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              The Creator Economy Is Broken
            </h2>
            <p className="text-base text-white/60 max-w-2xl mx-auto mb-8">
              97% of new tokens are rugs. Most creators earn less than $20K/year.
              Trust is dead. FlexIt fixes this.
            </p>

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

        {/* Target Audience */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-white mb-10">
              Who FlexIt Is For
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="glass-card rounded-xl p-6">
                <div className="text-accent-green font-bold text-lg mb-2">Alpha Hunters</div>
                <p className="text-white/50 text-sm">
                  Get verified signals and private wallet access to follow the best traders
                </p>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="text-accent-green font-bold text-lg mb-2">Degen Copycats</div>
                <p className="text-white/50 text-sm">
                  Copy trusted strategies from proven creators without getting rekt
                </p>
              </div>

              <div className="glass-card rounded-xl p-6">
                <div className="text-accent-green font-bold text-lg mb-2">Creator Kings</div>
                <p className="text-white/50 text-sm">
                  Monetize your reputation and build a liquid creator economy
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Launch Day Surge - Nikita Bier Coordinated Launch */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-5 py-2 mb-8">
              <BoltIcon className="h-4 w-4 text-accent-green" />
              <span className="text-accent-green font-medium text-xs tracking-wider">Launch Strategy</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
              <span className="text-white">Everyone Launches Together</span>
              <br />
              <span className="text-accent-green">March 15 at 4pm PT</span>
            </h2>

            <p className="text-lg text-white/60 mb-12 max-w-2xl mx-auto">
              All waitlist members get access simultaneously. Maximum network effects from day one.
            </p>

            {/* Countdown Box */}
            <div className="glass-card border border-accent-green/30 rounded-2xl p-8 mb-8">
              <p className="text-white/50 text-xs mb-4 uppercase tracking-wider font-medium">Launch Opens In</p>
              <div className="grid grid-cols-4 gap-3 max-w-xl mx-auto">
                <div className="glass-card rounded-xl p-3">
                  <div className="text-3xl md:text-4xl font-bold text-accent-green mb-1">
                    {launchCountdown.days}
                  </div>
                  <div className="text-white/40 text-xs">Days</div>
                </div>
                <div className="glass-card rounded-xl p-3">
                  <div className="text-3xl md:text-4xl font-bold text-accent-green mb-1">
                    {launchCountdown.hours}
                  </div>
                  <div className="text-white/40 text-xs">Hours</div>
                </div>
                <div className="glass-card rounded-xl p-3">
                  <div className="text-3xl md:text-4xl font-bold text-accent-green mb-1">
                    {launchCountdown.minutes}
                  </div>
                  <div className="text-white/40 text-xs">Minutes</div>
                </div>
                <div className="glass-card rounded-xl p-3">
                  <div className="text-3xl md:text-4xl font-bold text-accent-green mb-1">
                    {launchCountdown.seconds}
                  </div>
                  <div className="text-white/40 text-xs">Seconds</div>
                </div>
              </div>
            </div>

            {/* Why This Matters */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="glass-card rounded-xl p-5">
                <BoltIcon className="h-6 w-6 text-accent-green mb-3" />
                <h3 className="text-white font-semibold text-base mb-2">Instant Community</h3>
                <p className="text-white/50 text-sm">
                  Everyone starts together. No cold launch. Instant engagement.
                </p>
              </div>
              <div className="glass-card rounded-xl p-5">
                <SparklesIcon className="h-6 w-6 text-accent-green mb-3" />
                <h3 className="text-white font-semibold text-base mb-2">Network Effects</h3>
                <p className="text-white/50 text-sm">
                  Coordinated surge = maximum visibility and virality from minute one.
                </p>
              </div>
              <div className="glass-card rounded-xl p-5">
                <CheckCircleIcon className="h-6 w-6 text-accent-green mb-3" />
                <h3 className="text-white font-semibold text-base mb-2">Fair Advantage</h3>
                <p className="text-white/50 text-sm">
                  Early waitlist = early position. But everyone launches together.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="py-20 px-6 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">The Road Ahead</span>
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="glass-card rounded-xl p-6 border border-accent-green/20">
                <div className="text-accent-green font-bold text-sm mb-2">Q4 2025</div>
                <h3 className="text-white font-semibold text-base mb-2">Creator Tokens Launch</h3>
                <p className="text-white/50 text-sm">
                  Profile tokens go live. Start building your creator economy.
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 border border-accent-green/20">
                <div className="text-accent-green font-bold text-sm mb-2">Q1 2026</div>
                <h3 className="text-white font-semibold text-base mb-2">Copy Trading Live</h3>
                <p className="text-white/50 text-sm">
                  Follow and copy the best traders. Verified alpha, no more rugs.
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 border border-accent-green/20">
                <div className="text-accent-green font-bold text-sm mb-2">Q2 2026</div>
                <h3 className="text-white font-semibold text-base mb-2">Anon Mode & DAO</h3>
                <p className="text-white/50 text-sm">
                  Privacy features and community governance go live.
                </p>
              </div>

              <div className="glass-card rounded-xl p-6 border border-accent-green/20">
                <div className="text-accent-green font-bold text-sm mb-2">Q3-Q4 2026</div>
                <h3 className="text-white font-semibold text-base mb-2">Multi-Chain Expansion</h3>
                <p className="text-white/50 text-sm">
                  Beyond Solana. Scale to the cosmos.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What You Get - Simple List */}
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">Early Access Perks</span>
            </h2>

            <div className="space-y-3">
              {[
                { title: 'OG Founder Badge', desc: 'Verified on-chain. Flex your early adopter status forever.' },
                { title: '10x Launch Visibility', desc: 'Get featured to 10K+ degens on day one.' },
                { title: 'Priority Handle', desc: 'Reserve your @handle before the rush.' },
                { title: '5% Referral Revenue', desc: 'Lifetime commissions on everyone you bring in.' },
                { title: 'Direct Founder Access', desc: 'Private Discord. Alpha drops daily. Gods only.' },
              ].map((item, idx) => (
                <div key={idx} className="glass-card hover:border-accent-green/30 rounded-xl p-5 flex items-start gap-4 transition-all group">
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

        {/* Testimonials - Short & Punchy */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              <span className="text-white">What Degens Are Saying</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  quote: "Finally a creator token that's not a rug. Reputation staking is genius.",
                  author: "@AlphaSeeker",
                  metric: "Day 1"
                },
                {
                  quote: "I can actually monetize my calls without getting called a scammer. Built different.",
                  author: "@DegenKing",
                  metric: "OG Member"
                },
                {
                  quote: "Copy trading that's not sus? About time someone built this right.",
                  author: "@CryptoWhale",
                  metric: "Beta Tester"
                },
              ].map((t, idx) => (
                <div key={idx} className="glass-card rounded-xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-accent-green/20 rounded-full flex items-center justify-center">
                      <CheckCircleIcon className="h-5 w-5 text-accent-green" />
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{t.author}</div>
                      <div className="text-accent-green font-semibold text-xs">{t.metric}</div>
                    </div>
                  </div>
                  <p className="text-white/60 text-sm">&quot;{t.quote}&quot;</p>
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
                href="https://twitter.com/ShivamSspirit"
                target="_blank"
                rel="noopener noreferrer"
                className="glass-card px-6 py-3 rounded-lg hover:border-accent-green/40 transition-all border border-white/10"
              >
                <span className="text-white font-medium text-sm">@ShivamSspirit</span>
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
                      href="https://twitter.com/ShivamSspirit"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-accent-green text-sm transition-colors flex items-center gap-2"
                    >
                      <span>Twitter</span>
                      <span className="text-white/40">↗</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-accent-green text-sm transition-colors flex items-center gap-2"
                    >
                      <span>Telegram</span>
                      <span className="text-white/40">↗</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/60 hover:text-accent-green text-sm transition-colors flex items-center gap-2"
                    >
                      <span>Discord</span>
                      <span className="text-white/40">↗</span>
                    </a>
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
