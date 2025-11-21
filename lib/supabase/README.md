# Supabase Configuration

This directory contains all Supabase-related configuration, clients, and utilities.

## Directory Structure

```
lib/supabase/
├── index.ts              # Main exports
├── client.ts             # Client-side Supabase client (anonymous key)
├── server.ts             # Server-side Supabase client (service role key)
├── config.ts             # Configuration constants and validation
├── types.ts              # TypeScript types for database operations
├── migrations/           # SQL schema files
│   ├── 001_initial_schema.sql
│   ├── 002_schema_with_error_handling.sql
│   └── 003_simple_setup.sql
└── scripts/              # Setup and utility scripts
    └── setup-database.js
```

## Usage

### Client-Side Operations

```typescript
import { supabase } from '@/lib/supabase';

// Use for client-side queries with RLS
const { data, error } = await supabase
  .from('waitlist_signups')
  .select('*');
```

### Server-Side Operations

```typescript
import { supabaseAdmin } from '@/lib/supabase/server';

// Use in API routes or server components
// Has elevated permissions, bypasses RLS
const { data, error } = await supabaseAdmin
  .from('waitlist_signups')
  .insert({ email: 'user@example.com' });
```

### Type Safety

```typescript
import type { WaitlistSignup, JoinWaitlistResponse } from '@/lib/supabase/types';

const signup: WaitlistSignup = {
  id: '...',
  email: 'user@example.com',
  // ...
};
```

## Database Setup

Run one of the migration files in the Supabase SQL Editor:

1. **Recommended**: `003_simple_setup.sql` - Step-by-step setup with comments
2. **Production**: `001_initial_schema.sql` - Clean schema
3. **With Error Handling**: `002_schema_with_error_handling.sql` - Idempotent setup

Or use the setup script:

```bash
node lib/supabase/scripts/setup-database.js
```

## Environment Variables

Required variables (see `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Schema Overview

### Table: `waitlist_signups`

- `id` (UUID) - Primary key
- `email` (TEXT) - User email, unique
- `referral_code` (TEXT) - Unique 8-character code
- `referred_by` (TEXT) - Referral code of referrer
- `referral_count` (INTEGER) - Number of successful referrals
- `metadata` (JSONB) - Additional data
- `created_at` (TIMESTAMP) - Signup timestamp

### Features

- Automatic referral code generation
- Referral count tracking via triggers
- Row Level Security (RLS) enabled
- Performance indexes on key columns
