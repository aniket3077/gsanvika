"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Trash2, RefreshCw, AlertTriangle, Settings, Users, Package, ShoppingCart } from 'lucide-react'
import { AdminDataReset } from '@/lib/services/admin-data-reset'
import { toast } from 'sonner'

interface DataCounts {
  products: number
  orders: number
  customers: number
  users: number
  reviews: number
}

export function AdminDataResetPanel() {
  const [isLoading, setIsLoading] = useState(false)
  const [dataCounts, setDataCounts] = useState<DataCounts | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const loadDataCounts = async () => {
    try {
      setIsLoading(true)
      const counts = await AdminDataReset.getDataCounts()
      setDataCounts(counts as unknown as DataCounts)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('Error loading data counts:', error)
      toast.error('Failed to load data counts')
    } finally {
      setIsLoading(false)
    }
  }

  const resetAllData = async () => {
    if (!confirm('⚠️ WARNING: This will permanently delete ALL admin dashboard data. This action cannot be undone. Are you sure?')) {
      return
    }

    try {
      setIsLoading(true)
      toast.loading('Resetting all admin data...')
      
      await AdminDataReset.resetAllData()
      
      toast.dismiss()
      toast.success('All admin data has been reset successfully!')
      
      // Reload counts to show the reset
      await loadDataCounts()
      
    } catch (error) {
      console.error('Error resetting data:', error)
      toast.dismiss()
      toast.error('Failed to reset admin data')
    } finally {
      setIsLoading(false)
    }
  }

  const resetSpecificData = async (dataType: string, displayName: string) => {
    if (!confirm(`⚠️ WARNING: This will permanently delete all ${displayName} data. This action cannot be undone. Are you sure?`)) {
      return
    }

    try {
      setIsLoading(true)
      toast.loading(`Resetting ${displayName}...`)
      
      await AdminDataReset.resetSpecificData([dataType])
      
      toast.dismiss()
      toast.success(`${displayName} data has been reset successfully!`)
      
      // Reload counts to show the reset
      await loadDataCounts()
      
    } catch (error) {
      console.error(`Error resetting ${dataType}:`, error)
      toast.dismiss()
      toast.error(`Failed to reset ${displayName}`)
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    loadDataCounts()
  }, [])

  const dataItems = [
    { 
      key: 'products', 
      name: 'Products', 
      icon: Package, 
      description: 'All product listings and inventory',
      color: 'text-blue-600'
    },
    { 
      key: 'orders', 
      name: 'Orders', 
      icon: ShoppingCart, 
      description: 'Customer orders and transactions',
      color: 'text-green-600'
    },
    { 
      key: 'customers', 
      name: 'Customers', 
      icon: Users, 
      description: 'Customer profiles and information',
      color: 'text-purple-600'
    },
    { 
      key: 'users', 
      name: 'Users', 
      icon: Users, 
      description: 'User accounts and authentication',
      color: 'text-orange-600'
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Admin Data Reset
          </CardTitle>
          <CardDescription>
            Manage and reset admin dashboard data. Use with caution as these actions are irreversible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Current Data Overview */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Current Data Overview</h3>
              <Button
                onClick={loadDataCounts}
                disabled={isLoading}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {dataCounts ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dataItems.map((item) => {
                  const IconComponent = item.icon
                  const count = dataCounts[item.key as keyof DataCounts] || 0
                  
                  return (
                    <div key={item.key} className="bg-muted/50 rounded-lg p-4 text-center">
                      <IconComponent className={`h-6 w-6 mx-auto mb-2 ${item.color}`} />
                      <div className="text-2xl font-bold">{count.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">{item.name}</div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {dataItems.map((item) => (
                  <div key={item.key} className="bg-muted/50 rounded-lg p-4 text-center animate-pulse">
                    <div className="h-6 w-6 mx-auto mb-2 bg-muted rounded" />
                    <div className="h-8 bg-muted rounded mb-1" />
                    <div className="h-4 bg-muted rounded" />
                  </div>
                ))}
              </div>
            )}
            
            {lastUpdated && (
              <p className="text-xs text-muted-foreground text-center">
                Last updated: {lastUpdated.toLocaleString()}
              </p>
            )}
          </div>

          {/* Individual Reset Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Reset Specific Data</h3>
            <div className="grid gap-4">
              {dataItems.map((item) => {
                const IconComponent = item.icon
                const count = dataCounts?.[item.key as keyof DataCounts] || 0
                
                return (
                  <div key={item.key} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <IconComponent className={`h-5 w-5 ${item.color}`} />
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">{item.description}</div>
                        <div className="text-xs text-muted-foreground">
                          Current count: {count.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => resetSpecificData(item.key, item.name)}
                      disabled={isLoading || count === 0}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Reset {item.name}
                    </Button>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reset All Data */}
          <div className="space-y-4 border-t pt-6">
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-destructive">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  This action will permanently delete ALL admin dashboard data including products, orders, customers, and users. 
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <Button
                onClick={resetAllData}
                disabled={isLoading}
                variant="destructive"
                size="lg"
                className="min-w-[200px]"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Reset All Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
