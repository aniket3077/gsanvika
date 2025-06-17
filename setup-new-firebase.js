#!/usr/bin/env node

/**
 * 🔥 Setup New Firebase Project Script
 * 
 * This script helps you configure a new Firebase project
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔥 Firebase Project Setup Assistant\n');

console.log('Current issue: Firebase project "e-com-620fe" returns 404 (not found)');
console.log('This means the project doesn\'t exist or API key is invalid.\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupNewFirebase() {
  console.log('🎯 Choose an option:\n');
  console.log('1. I have created a new Firebase project and have the config');
  console.log('2. I want to use a demo Firebase project for testing');
  console.log('3. I need help creating a new Firebase project');
  console.log('4. Exit and fix manually\n');
  
  const choice = await askQuestion('Enter your choice (1-4): ');
  
  switch (choice) {
    case '1':
      await setupWithNewConfig();
      break;
    case '2':
      await setupWithDemo();
      break;
    case '3':
      await showSetupGuide();
      break;
    case '4':
      console.log('👍 Exiting. Please check FIREBASE_ERROR_FIX.md for manual setup steps.');
      break;
    default:
      console.log('❌ Invalid choice. Please run the script again.');
      break;
  }
  
  rl.close();
}

async function setupWithNewConfig() {
  console.log('\n🔧 Setting up with your new Firebase project...\n');
  
  const apiKey = await askQuestion('Enter your Firebase API Key: ');
  const projectId = await askQuestion('Enter your Firebase Project ID: ');  const appId = await askQuestion('Enter your Firebase App ID: ');
  const senderId = await askQuestion('Enter your Messaging Sender ID: ');
  
  const authDomain = `${projectId}.firebaseapp.com`;
  const storageBucket = `${projectId}.appspot.com`;
  
  console.log('\n📝 Setting environment variables...\n');
  
  const envVars = [
    { key: 'NEXT_PUBLIC_FIREBASE_API_KEY', value: apiKey },
    { key: 'NEXT_PUBLIC_FIREBASE_PROJECT_ID', value: projectId },
    { key: 'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN', value: authDomain },
    { key: 'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET', value: storageBucket },
    { key: 'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', value: senderId },
    { key: 'NEXT_PUBLIC_FIREBASE_APP_ID', value: appId },
  ];  
  try {
    envVars.forEach(({ key, value }) => {
      console.log(`${key}=${value}`);
      console.log(`✅ Environment variable: ${key}`);
    });
    
    console.log('\n🚀 Configuration generated successfully!');
    console.log('\n📋 Please set these environment variables in your deployment platform:');
    envVars.forEach(({ key, value }) => {
      console.log(`${key}="${value}"`);
    });
    
    console.log('\n🎉 Setup complete! Deploy your application with the new configuration.');
    
  } catch (error) {
    console.log('❌ Error setting up Firebase:', error.message);
  }
}

async function setupWithDemo() {
  console.log('\n🎮 Setting up with demo Firebase project for testing...\n');
  
  // Demo Firebase config (you would need to create this)
  console.log('⚠️  Demo configuration is not available in this script.');
  console.log('Please create a new Firebase project following the guide.');
  console.log('It only takes 5 minutes and gives you full control.');
}

async function showSetupGuide() {
  console.log('\n📖 Quick Firebase Project Creation Guide:\n');
  
  console.log('1. Go to: https://console.firebase.google.com/');
  console.log('2. Click "Create a project"');
  console.log('3. Enter project name: "global-saanvika-ecommerce"');
  console.log('4. Disable Google Analytics (optional)');
  console.log('5. Wait for project creation');
  console.log('6. Click "Web" icon (</>) to add web app');
  console.log('7. Enter app name: "ecommerce-app"');
  console.log('8. Copy the config object from the setup page');
  console.log('9. Run this script again and choose option 1');
  
  console.log('\n🔧 Enable required services:');
  console.log('- Authentication → Email/Password');
  console.log('- Firestore Database → Create in test mode');
  console.log('- Storage → Create in test mode');
  
  console.log('\n⏱️  Total time: ~5 minutes');
  console.log('💰 Cost: Free tier (more than enough for testing)');
}

// Run the setup
setupNewFirebase().catch(console.error);
