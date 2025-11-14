#!/usr/bin/env node

/**
 * Smart Dev Server Starter
 * Automatically handles port conflicts and cleans up lock files
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const net = require('net');

console.log('🚀 Starting FlexIt Dev Server...\n');

// 1. Kill any existing Next.js dev servers
console.log('🧹 Cleaning up existing processes...');
try {
  execSync('pkill -9 -f "next dev" 2>/dev/null || true', { stdio: 'ignore' });
  execSync('pkill -9 -f "node.*next" 2>/dev/null || true', { stdio: 'ignore' });
  console.log('✅ Killed existing Next.js processes\n');
} catch (e) {
  // Ignore errors if no processes found
}

// 2. Clean up lock files
console.log('🔓 Removing lock files...');
const lockPath = path.join(__dirname, '.next', 'dev', 'lock');
try {
  if (fs.existsSync(lockPath)) {
    fs.unlinkSync(lockPath);
    console.log('✅ Removed lock file\n');
  } else {
    console.log('✅ No lock file found\n');
  }
} catch (e) {
  console.log('⚠️  Could not remove lock file:', e.message);
}

// 3. Find available port
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on('error', () => resolve(false));
  });
}

async function findAvailablePort(startPort = 3000, maxAttempts = 10) {
  for (let i = 0; i < maxAttempts; i++) {
    const port = startPort + i;
    const isAvailable = await checkPort(port);
    if (isAvailable) {
      return port;
    }
  }
  return null;
}

// 4. Start the dev server
(async () => {
  console.log('🔍 Finding available port...');
  const port = await findAvailablePort(3000);

  if (!port) {
    console.error('❌ No available ports found (tried 3000-3009)');
    process.exit(1);
  }

  console.log(`✅ Port ${port} is available\n`);
  console.log(`🎯 Starting Next.js on http://localhost:${port}\n`);
  console.log('═'.repeat(50));
  console.log('');

  // Start Next.js dev server
  const nextDev = spawn('pnpm', ['exec', 'next', 'dev', '-p', port.toString()], {
    stdio: 'inherit',
    shell: true,
  });

  // Handle exit
  process.on('SIGINT', () => {
    console.log('\n\n🛑 Shutting down dev server...');
    nextDev.kill('SIGINT');
    process.exit(0);
  });

  nextDev.on('exit', (code) => {
    if (code !== 0) {
      console.error(`\n❌ Dev server exited with code ${code}`);
      process.exit(code);
    }
  });
})();
