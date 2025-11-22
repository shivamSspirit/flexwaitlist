/**
 * Supabase configuration constants
 */

export const SUPABASE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
} as const;

export const WAITLIST_CONFIG = {
  tableName: 'waitlist_signups',
  betaSlots: 500,
  referralCodeLength: 8,
} as const;

export const STORAGE_CONFIG = {
  bucketName: 'flex_wait',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
} as const;

/**
 * Validates that all required Supabase environment variables are set
 */
export function validateSupabaseConfig() {
  const required = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required Supabase environment variables: ${missing.join(', ')}`
    );
  }
}
