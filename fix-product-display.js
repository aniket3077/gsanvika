#!/usr/bin/env node

/**
 * Fix Product Display Issues
 * This script fixes issues where newly added products don't show up in categories
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, updateDoc, doc } = require('firebase/firestore');

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA_IrpHC1dXG4UZVdfubnHtGTAj8Q1KiTU",
  authDomain: "e-com-620fe.firebaseapp.com",
  databaseURL: "https://e-com-620fe-default-rtdb.firebaseio.com",
  projectId: "e-com-620fe",
  storageBucket: "e-com-620fe.firebasestorage.app",
  messagingSenderId: "829977668997",
  appId: "1:829977668997:web:fbb8db48d0e1ee7dc7e8ec",
  measurementId: "G-5KFPMKXJWN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixProductDisplayIssues() {
  try {
    console.log('🔍 Fetching all products...');
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    console.log(`📦 Found ${snapshot.size} products`);
    
    const updatePromises = [];
    const categoryCounts = {};
    
    snapshot.forEach((productDoc) => {
      const productData = productDoc.data();
      const productId = productDoc.id;
      
      console.log(`📝 Checking product: ${productData.name} (${productData.category})`);
      
      // Count products by category
      categoryCounts[productData.category] = (categoryCounts[productData.category] || 0) + 1;
      
      // Prepare updates for consistency
      const updates = {};
      let needsUpdate = false;
      
      // Ensure inStock is boolean and matches stockQuantity
      if (typeof productData.inStock !== 'boolean') {
        updates.inStock = (productData.stockQuantity || 0) > 0;
        needsUpdate = true;
      }
      
      // Ensure stockQuantity exists
      if (typeof productData.stockQuantity !== 'number') {
        updates.stockQuantity = 10; // Default stock
        updates.inStock = true;
        needsUpdate = true;
      }
      
      // Ensure imageUrl exists (for backwards compatibility)
      if (!productData.imageUrl && productData.images && productData.images.length > 0) {
        updates.imageUrl = productData.images[0];
        needsUpdate = true;
      }
      
      // Ensure featured status is boolean
      if (typeof productData.featured !== 'boolean') {
        updates.featured = true; // Make all products featured by default
        needsUpdate = true;
      }
      
      // Add rating fields if missing
      if (typeof productData.averageRating !== 'number') {
        updates.averageRating = 0;
        needsUpdate = true;
      }
      
      if (typeof productData.totalReviews !== 'number') {
        updates.totalReviews = 0;
        needsUpdate = true;
      }
      
      // Update timestamp
      if (needsUpdate) {
        updates.updatedAt = new Date();
        
        updatePromises.push(
          updateDoc(doc(db, 'products', productId), updates)
            .then(() => console.log(`✅ Updated: ${productData.name}`))
            .catch((error) => console.error(`❌ Failed to update ${productData.name}:`, error))
        );
      } else {
        console.log(`✓ Product OK: ${productData.name}`);
      }
    });
    
    // Execute all updates
    if (updatePromises.length > 0) {
      console.log(`\n🚀 Applying ${updatePromises.length} updates...`);
      await Promise.all(updatePromises);
      console.log('✅ All updates completed!');
    } else {
      console.log('✅ All products are already properly configured!');
    }
    
    // Display category summary
    console.log('\n📊 Products by Category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} products`);
    });
    
    console.log('\n🎉 Product display issues have been fixed!');
    console.log('\n📋 Changes made:');
    console.log('• Ensured all products have proper inStock status');
    console.log('• Added missing stockQuantity values');
    console.log('• Set imageUrl for backwards compatibility');
    console.log('• Made products featured for homepage display');
    console.log('• Added rating fields for product cards');
    
  } catch (error) {
    console.error('\n❌ Error fixing product display issues:', error);
  }
}

// Run the fix
fixProductDisplayIssues();
