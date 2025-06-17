#!/usr/bin/env node

/**
 * Deploy Firebase Storage Rules
 * Run this script to deploy the updated storage rules to Firebase
 */

const { execSync } = require('child_process');

console.log('🔥 Deploying Firebase Storage Rules...\n');

try {
  // Check if Firebase CLI is installed
  try {
    execSync('firebase --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('❌ Firebase CLI not found. Installing...');
    execSync('npm install -g firebase-tools', { stdio: 'inherit' });
  }

  // Deploy storage rules
  console.log('📝 Deploying storage rules...');
  execSync('firebase deploy --only storage', { stdio: 'inherit' });
  
  console.log('\n✅ Storage rules deployed successfully!');
  console.log('\n🔧 Changes made:');
  console.log('• Added explicit delete permissions for authenticated users');
  console.log('• Updated products folder permissions');
  console.log('• Fixed permission structure for better security');
  
} catch (error) {
  console.error('\n❌ Error deploying storage rules:', error.message);
  console.log('\n📋 Manual steps:');
  console.log('1. Install Firebase CLI: npm install -g firebase-tools');
  console.log('2. Login to Firebase: firebase login');
  console.log('3. Deploy rules: firebase deploy --only storage');
}
