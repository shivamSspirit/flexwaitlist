#!/usr/bin/env node

/**
 * Quick Setup Checker for FlexIt Waitlist
 * Run: node check-setup.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local manually (no dotenv dependency needed)
function loadEnv() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    return {};
  }

  const envFile = fs.readFileSync(envPath, 'utf8');
  const env = {};

  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      env[key] = value;
    }
  });

  return env;
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n🔍 Checking FlexIt Waitlist Setup...\n');

// Check 1: Environment Variables
console.log('1️⃣  Environment Variables:');
if (!supabaseUrl) {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_URL is missing');
} else {
  console.log('   ✅ NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl);
}

if (!supabaseKey) {
  console.log('   ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
} else {
  console.log('   ✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: ' + supabaseKey.substring(0, 20) + '...');
}

if (!supabaseUrl || !supabaseKey) {
  console.log('\n❌ Please create .env.local with your Supabase credentials\n');
  process.exit(1);
}

// Check 2: Database Connection
console.log('\n2️⃣  Database Connection:');
const supabase = createClient(supabaseUrl, supabaseKey);

supabase
  .from('waitlist_signups')
  .select('*')
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.log('   ❌ Table not found:', error.message);
      console.log('\n📋 SETUP REQUIRED:');
      console.log('   Read SETUP_DATABASE.md for instructions');
      console.log('   Quick: Go to Supabase Dashboard → SQL Editor');
      console.log('   Run: supabase-waitlist-schema.sql\n');
      process.exit(1);
    } else {
      console.log('   ✅ waitlist_signups table exists');

      // Check 3: Data
      console.log('\n3️⃣  Current Signups:');
      return supabase
        .from('waitlist_signups')
        .select('*', { count: 'exact' });
    }
  })
  .then(({ data, count, error }) => {
    if (error) {
      console.log('   ⚠️  Could not fetch data:', error.message);
    } else {
      console.log(`   📊 Total signups: ${count || 0}`);
      if (count && count > 0) {
        console.log('   ✅ Waitlist is collecting signups!');
      }
    }

    console.log('\n✨ Setup Status: READY');
    console.log('\n🚀 Your waitlist is ready to go!');
    console.log('   Run: pnpm run dev');
    console.log('   Visit: http://localhost:3000\n');
  })
  .catch((err) => {
    console.error('\n❌ Error:', err.message);
    console.log('\n📖 Check SETUP_DATABASE.md for help\n');
    process.exit(1);
  });
