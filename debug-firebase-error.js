#!/usr/bin/env node

/**
 * 🔍 Firebase SDK Debug Script
 * 
 * This script helps diagnose Firebase SDK loading issues
 */

const https = require('https');

console.log('🔍 Firebase SDK Debug Analysis\n');

// Check environment variables
console.log('📋 Environment Variables Status:');
const envVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID'
];

envVars.forEach(varName => {
  const value = process.env[varName];
  console.log(`${varName}: ${value ? '✅ Set' : '❌ Missing'}`);
});

// Test Firebase project connectivity
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'e-com-620fe';
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyA_IrpHC1dXG4UZVdfubnHtGTAj8Q1KiTU';

console.log('\n🔗 Testing Firebase Project Connectivity...');

// Test Firebase REST API
const testUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents?key=${apiKey}`;

https.get(testUrl, (res) => {
  console.log(`Firebase API Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (res.statusCode === 200) {
      console.log('✅ Firebase project is accessible');
    } else {
      console.log('❌ Firebase project access failed');
      console.log('Response:', data);
    }
  });
}).on('error', (err) => {
  console.log('❌ Firebase connectivity test failed:', err.message);
});

console.log('\n🔧 Potential Solutions:');
console.log('1. Check browser console for specific error messages');
console.log('2. Verify Firebase project is active and billing is enabled');
console.log('3. Check if API key has proper permissions');
console.log('4. Ensure environment variables are set properly');
console.log('5. Try regenerating Firebase API key');

console.log('\n📖 Debug Commands:');
console.log('- Open browser console in your application');
console.log('- Run: debugFirebase() in browser console');
console.log('- Check Network tab for failed requests');
