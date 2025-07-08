import React from 'react'
import { ProtectedRoute } from '@/components/auth/protected-route'
import AdminOrderEditClient from './admin-order-edit-client'

// Force dynamic rendering for admin pages that require authentication
export const dynamic = 'force-dynamic'

export default async function EditOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  return (
    <ProtectedRoute requireAdmin={true}>
      <AdminOrderEditClient id={id} />
    </ProtectedRoute>
  )
}
