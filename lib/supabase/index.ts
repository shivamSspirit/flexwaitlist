/**
 * Supabase library - centralized Supabase configuration and utilities
 *
 * Usage:
 * - Client-side: import { supabase } from '@/lib/supabase'
 * - Server-side: import { supabaseAdmin } from '@/lib/supabase/server'
 * - Types: import type { WaitlistSignup } from '@/lib/supabase/types'
 */

export { supabase } from './client';
export { supabaseAdmin } from './server';
export { SUPABASE_CONFIG, WAITLIST_CONFIG, validateSupabaseConfig } from './config';
export type {
  WaitlistSignup,
  WaitlistStats,
  JoinWaitlistRequest,
  JoinWaitlistResponse,
} from './types';
