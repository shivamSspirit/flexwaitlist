import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

interface WaitlistStats {
  totalSignups: number;
  betaSlots: number;
  slotsRemaining: number;
  slotsClaimed: number;
  percentageFilled: number;
}

interface JoinResponse {
  referralCode: string;
  position: number;
  referralUrl: string;
  message: string;
  alreadyRegistered?: boolean;
}

/**
 * Hook to fetch waitlist stats
 */
export function useWaitlistStats() {
  return useQuery({
    queryKey: ['waitlistStats'],
    queryFn: async () => {
      const response = await fetch('/api/waitlist/join');
      if (!response.ok) throw new Error('Failed to fetch stats');
      const data = await response.json();

      // Return actual stats from database
      return {
        ...data.data,
        slotsClaimed: data.data.slotsClaimed || 0,
        slotsRemaining: data.data.slotsRemaining || 500,
        percentageFilled: data.data.percentageFilled || 0,
      };
    },
    staleTime: 5000,
    refetchInterval: 10000, // Refresh every 10 seconds
  });
}

/**
 * Hook to join waitlist
 */
export function useJoinWaitlist() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, referralCode }: { email: string; referralCode?: string }) => {
      const response = await fetch('/api/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, referralCode }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to join waitlist');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate stats to refresh count
      queryClient.invalidateQueries({ queryKey: ['waitlistStats'] });
    },
  });
}

/**
 * Hook for countdown timer to deadline
 * Nikita Bier Strategy: Create urgency with time pressure
 */
export function useCountdown(targetDate: Date) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Convert to timestamp once at the start to avoid re-renders
    const targetTimestamp = targetDate.getTime();

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTimestamp - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate.getTime()]);

  return timeLeft;
}
