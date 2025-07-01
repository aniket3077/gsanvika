"use client"

import React from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AdminDataResetPanel } from '@/components/admin/data-reset-panel'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'

export default function AdminDataResetPage() {
  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Header */}
          <div className="mb-8">
            <Link href="/admin">
              <Button variant="ghost" className="mb-4">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Admin Dashboard
              </Button>
            </Link>
            
            <div>
              <h1 className="font-serif text-3xl font-bold text-foreground tracking-tight">
                Data Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Reset and manage admin dashboard data
              </p>
            </div>
          </div>

          {/* Reset Panel */}
          <AdminDataResetPanel />

          {/* Additional Information */}
          <div className="mt-8 p-6 bg-muted/50 rounded-lg">
            <h2 className="text-lg font-semibold mb-3">Important Notes</h2>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• All data reset operations are permanent and cannot be undone</p>
              <p>• Consider backing up important data before performing any reset</p>
              <p>• The dashboard statistics will immediately reflect the changes</p>
              <p>• You can also use CLI commands: <code className="bg-background px-2 py-1 rounded text-foreground">npm run reset-admin-data</code></p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
