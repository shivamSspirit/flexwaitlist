#!/usr/bin/env node

/**
 * Database Setup Script for FlexIt Waitlist
 *
 * This script creates the waitlist_signups table in Supabase
 * Run: node setup-database.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ ERROR: Missing Supabase credentials');
  console.error('\nPlease ensure your .env.local file contains:');
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key');
  console.error('  SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (optional but recommended)\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  try {
    // Read the SQL schema file
    const schemaPath = path.join(__dirname, 'supabase-waitlist-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📄 Loaded schema from supabase-waitlist-schema.sql');

    // Split SQL into individual statements (simplified version)
    // We'll execute the whole thing as one for simplicity
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: schema });

    if (error) {
      // If exec_sql doesn't exist, we need to use direct SQL execution
      console.log('⚠️  Cannot use RPC, trying alternative method...\n');

      console.log('📋 MANUAL SETUP REQUIRED:');
      console.log('\n1. Go to your Supabase Dashboard: ' + supabaseUrl.replace('.supabase.co', '.supabase.co/project/_/sql'));
      console.log('2. Click on "SQL Editor" in the left sidebar');
      console.log('3. Click "New Query"');
      console.log('4. Copy and paste the SQL from: supabase-waitlist-schema.sql');
      console.log('5. Click "Run" to execute\n');

      console.log('OR use the Supabase CLI:');
      console.log('  npx supabase db push\n');

      return;
    }

    console.log('✅ Database setup complete!\n');
    console.log('Created:');
    console.log('  ✓ waitlist_signups table');
    console.log('  ✓ Performance indexes');
    console.log('  ✓ Referral count trigger');
    console.log('  ✓ Row Level Security policies\n');

    // Test the table
    const { data: testData, error: testError } = await supabase
      .from('waitlist_signups')
      .select('*')
      .limit(1);

    if (testError) {
      console.log('⚠️  Table created but there was an issue testing it:', testError.message);
      console.log('   This is usually fine - try submitting an email on your website.\n');
    } else {
      console.log('✅ Table is working correctly!\n');
    }

    console.log('🎉 You can now accept waitlist signups!\n');

  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    console.error('\nPlease set up the database manually:');
    console.error('1. Go to: ' + supabaseUrl.replace('.supabase.co', '.supabase.co/project/_/sql'));
    console.error('2. Open SQL Editor');
    console.error('3. Run the SQL from supabase-waitlist-schema.sql\n');
    process.exit(1);
  }
}

// Run the setup
setupDatabase();
