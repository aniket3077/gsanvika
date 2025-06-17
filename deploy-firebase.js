#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔥 Starting Firebase deployment process...');

// Use main environment variables
if (fs.existsSync('.env')) {
  console.log('✅ Using environment variables from .env');
} else {
  console.log('⚠️ Warning: .env file not found');
}

try {
  // Clean previous builds
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
    console.log('🧹 Cleaned previous build');
  }

  // Build the application
  console.log('🏗️  Building application for Firebase...');
  execSync('npm run build:firebase', { stdio: 'inherit' });

  // Deploy to Firebase
  console.log('🚀 Deploying to Firebase Hosting...');
  execSync('firebase deploy --only hosting', { stdio: 'inherit' });

  console.log('✅ Firebase deployment completed successfully!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
