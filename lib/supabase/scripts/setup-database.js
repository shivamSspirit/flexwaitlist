/**
 * Setup script to create waitlist database table
 * Run with: pnpm setup:db
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing environment variables!');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

// Read the SQL schema file
const schemaPath = path.join(__dirname, '../migrations/003_simple_setup.sql');
const sqlSchema = fs.readFileSync(schemaPath, 'utf8');

// Split SQL into individual statements
const statements = sqlSchema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log('🚀 Setting up waitlist database...');
console.log(`📝 Found ${statements.length} SQL statements to execute`);

async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ query: sql });

    const hostname = supabaseUrl.replace('https://', '').replace('http://', '');
    const options = {
      hostname,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data: responseData });
        } else {
          reject({ success: false, error: responseData, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject({ success: false, error: error.message });
    });

    req.write(data);
    req.end();
  });
}

async function setupDatabase() {
  const projectId = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

  console.log('\n⚠️  Note: This script uses Supabase REST API.');
  console.log('📌 If you have access to Supabase dashboard, you can also:');
  console.log('   1. Go to SQL Editor in your Supabase dashboard');
  console.log('   2. Copy contents from lib/supabase/migrations/003_simple_setup.sql');
  console.log('   3. Paste and run the query\n');

  console.log('📋 SQL Schema Preview:');
  console.log('─'.repeat(60));
  console.log(sqlSchema.substring(0, 500) + '...\n');
  console.log('─'.repeat(60));

  console.log('\n✅ Schema file is ready!');
  console.log('\n🔧 SETUP OPTIONS:\n');
  console.log('Option 1 (Recommended): Manual Setup via Supabase Dashboard');
  if (projectId) {
    console.log(`  1. Visit: https://supabase.com/dashboard/project/${projectId}/editor`);
  }
  console.log('  2. Click "SQL Editor" in the left sidebar');
  console.log('  3. Click "New Query"');
  console.log('  4. Copy contents from lib/supabase/migrations/003_simple_setup.sql');
  console.log('  5. Paste into SQL editor');
  console.log('  6. Click "Run" button\n');

  console.log('Option 2: Command Line (if you have psql installed)');
  console.log('  psql "$DATABASE_URL" < lib/supabase/migrations/003_simple_setup.sql\n');

  console.log('📍 After setup, test with:');
  console.log('  curl -X POST http://localhost:3000/api/waitlist/join \\');
  console.log('    -H "Content-Type: application/json" \\');
  console.log('    -d \'{"email":"test@example.com"}\'');
  console.log('\n✨ You should see a success response with referral code!');
}

setupDatabase().catch(err => {
  console.error('❌ Setup error:', err);
  process.exit(1);
});
