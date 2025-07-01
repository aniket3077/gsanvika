import { getFirestore } from '@/lib/firebase'
import { collection, getDocs, doc, deleteDoc, writeBatch } from 'firebase/firestore'

/**
 * Reset Admin Dashboard Data
 * This script will clear all data from Firebase collections used by the admin dashboard
 */

export class AdminDataReset {
  private static async getDb() {
    return await getFirestore()
  }

  /**
   * Clear all documents from a specific collection
   */
  private static async clearCollection(collectionName: string): Promise<number> {
    try {
      const db = await this.getDb()
      const collectionRef = collection(db, collectionName)
      const snapshot = await getDocs(collectionRef)
      
      if (snapshot.empty) {
        console.log(`Collection '${collectionName}' is already empty`)
        return 0
      }

      // Use batch for efficient deletion
      const batch = writeBatch(db)
      let count = 0

      snapshot.docs.forEach((document) => {
        batch.delete(doc(db, collectionName, document.id))
        count++
      })

      await batch.commit()
      console.log(`✅ Cleared ${count} documents from '${collectionName}' collection`)
      return count
    } catch (error) {
      console.error(`❌ Error clearing collection '${collectionName}':`, error)
      throw error
    }
  }

  /**
   * Clear all admin dashboard data
   */
  static async resetAllData(): Promise<void> {
    console.log('🔄 Starting admin dashboard data reset...')
    
    try {
      const collections = [
        'products',
        'orders', 
        'customers',
        'users',
        'reviews',
        'categories',
        'analytics',
        'notifications'
      ]

      let totalDeleted = 0

      for (const collectionName of collections) {
        try {
          const deleted = await this.clearCollection(collectionName)
          totalDeleted += deleted
        } catch (error) {
          console.warn(`⚠️ Could not clear collection '${collectionName}' (it may not exist):`, error)
        }
      }

      console.log(`✅ Dashboard reset complete! Total documents deleted: ${totalDeleted}`)
      console.log('📊 Dashboard statistics have been reset to zero')
      console.log('🎯 You can now start fresh with clean data')

    } catch (error) {
      console.error('❌ Error during dashboard reset:', error)
      throw error
    }
  }

  /**
   * Reset only specific data types
   */
  static async resetSpecificData(dataTypes: string[]): Promise<void> {
    console.log(`🔄 Resetting specific data types: ${dataTypes.join(', ')}`)
    
    try {
      let totalDeleted = 0

      for (const collectionName of dataTypes) {
        try {
          const deleted = await this.clearCollection(collectionName)
          totalDeleted += deleted
        } catch (error) {
          console.warn(`⚠️ Could not clear collection '${collectionName}':`, error)
        }
      }

      console.log(`✅ Selective reset complete! Total documents deleted: ${totalDeleted}`)

    } catch (error) {
      console.error('❌ Error during selective reset:', error)
      throw error
    }
  }

  /**
   * Get current data counts before reset
   */
  static async getDataCounts(): Promise<Record<string, number>> {
    console.log('📊 Getting current data counts...')
    
    try {
      const db = await this.getDb()
      const collections = ['products', 'orders', 'customers', 'users', 'reviews']
      const counts: Record<string, number> = {}

      for (const collectionName of collections) {
        try {
          const snapshot = await getDocs(collection(db, collectionName))
          counts[collectionName] = snapshot.size
        } catch (error) {
          counts[collectionName] = 0
        }
      }

      console.log('Current data counts:', counts)
      return counts
    } catch (error) {
      console.error('❌ Error getting data counts:', error)
      throw error
    }
  }
}

// Export helper functions for specific resets
export const resetProducts = () => AdminDataReset.resetSpecificData(['products'])
export const resetOrders = () => AdminDataReset.resetSpecificData(['orders'])
export const resetCustomers = () => AdminDataReset.resetSpecificData(['customers'])
export const resetAllAdminData = () => AdminDataReset.resetAllData()
export const getAdminDataCounts = () => AdminDataReset.getDataCounts()
