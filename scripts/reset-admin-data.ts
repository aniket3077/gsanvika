#!/usr/bin/env node

/**
 * Admin Dashboard Data Reset Script
 * 
 * Usage:
 *   npm run reset-admin-data           # Reset all data
 *   npm run reset-admin-data products  # Reset only products
 *   npm run reset-admin-data orders    # Reset only orders
 *   npm run reset-admin-data customers # Reset only customers
 */

import { AdminDataReset } from '../lib/services/admin-data-reset'

async function main() {
  const args = process.argv.slice(2)
  const resetType = args[0]

  console.log('🚀 Admin Dashboard Data Reset Tool')
  console.log('==================================')

  try {
    // Show current data counts first
    await AdminDataReset.getDataCounts()
    console.log('')

    if (!resetType) {
      // Reset all data
      console.log('⚠️  WARNING: This will delete ALL admin dashboard data!')
      console.log('Press Ctrl+C to cancel or wait 5 seconds to continue...')
      
      await new Promise(resolve => setTimeout(resolve, 5000))
      await AdminDataReset.resetAllData()
      
    } else {
      // Reset specific data type
      const validTypes = ['products', 'orders', 'customers', 'users', 'reviews']
      
      if (!validTypes.includes(resetType)) {
        console.error(`❌ Invalid reset type: ${resetType}`)
        console.log(`Valid types: ${validTypes.join(', ')}`)
        process.exit(1)
      }

      console.log(`⚠️  WARNING: This will delete all ${resetType} data!`)
      console.log('Press Ctrl+C to cancel or wait 3 seconds to continue...')
      
      await new Promise(resolve => setTimeout(resolve, 3000))
      await AdminDataReset.resetSpecificData([resetType])
    }

    console.log('')
    console.log('🎉 Reset completed successfully!')
    console.log('You can now refresh your admin dashboard to see the changes.')

  } catch (error) {
    console.error('💥 Reset failed:', error)
    process.exit(1)
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Reset cancelled by user')
  process.exit(0)
})

main()
