"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { XCircle, AlertTriangle } from 'lucide-react'
import { Order, FirebaseOrdersService } from '@/lib/firebase/orders'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/common'

interface CancelOrderProps {
  order: Order
  onOrderCancelled?: () => void
  variant?: 'button' | 'link'
  size?: 'sm' | 'default' | 'lg'
  disabled?: boolean
}

const CANCELLATION_REASONS = [
  'Changed my mind',
  'Found a better price elsewhere',
  'Ordered by mistake',
  'Need to modify the order',
  'Delivery taking too long',
  'Payment issues',
  'Other'
]

export function CancelOrderButton({ 
  order, 
  onOrderCancelled, 
  variant = 'button',
  size = 'default',
  disabled = false
}: CancelOrderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCancelling, setIsCancelling] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  // Check if order can be cancelled
  const canCancel = order.status === 'pending' || order.status === 'processing'

  const handleCancel = async () => {
    if (!canCancel) {
      toast.error('This order cannot be cancelled')
      return
    }

    setIsCancelling(true)
    try {
      const reason = selectedReason === 'Other' ? customReason : selectedReason
      await FirebaseOrdersService.cancelOrder(order.id!, reason)
      
      toast.success('Order cancelled successfully', {
        description: 'You will receive a confirmation email shortly'
      })
      
      // Close dialogs
      setIsOpen(false)
      setShowConfirmDialog(false)
      
      // Reset form
      setSelectedReason('')
      setCustomReason('')
      
      // Callback to refresh order data
      if (onOrderCancelled) {
        onOrderCancelled()
      }
    } catch (error) {
      console.error('Error cancelling order:', error)
      toast.error('Failed to cancel order', {
        description: error instanceof Error ? error.message : 'Please try again later'
      })
    } finally {
      setIsCancelling(false)
    }
  }

  const handleReasonSubmit = () => {
    if (!selectedReason) {
      toast.error('Please select a cancellation reason')
      return
    }
    
    if (selectedReason === 'Other' && !customReason.trim()) {
      toast.error('Please provide a reason for cancellation')
      return
    }
    
    setIsOpen(false)
    setShowConfirmDialog(true)
  }

  if (!canCancel && !disabled) {
    return null // Don't show button if order can't be cancelled
  }

  const buttonContent = (
    <>
      <XCircle className="h-4 w-4 mr-2" />
      Cancel Order
    </>
  )

  return (
    <>
      {/* Cancellation Reason Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {variant === 'button' ? (
            <Button
              variant="outline"
              size={size}
              disabled={disabled || !canCancel}
              className={cn(
                "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700",
                !canCancel && "opacity-50 cursor-not-allowed"
              )}
            >
              {buttonContent}
            </Button>
          ) : (
            <button
              disabled={disabled || !canCancel}
              className={cn(
                "text-red-600 hover:text-red-700 text-sm underline",
                !canCancel && "opacity-50 cursor-not-allowed"
              )}
            >
              Cancel Order
            </button>
          )}
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Cancel Order
            </DialogTitle>
            <DialogDescription>
              Please let us know why you're cancelling order #{order.id?.slice(-8) || 'N/A'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-3">
              <Label>Reason for cancellation</Label>
              <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
                {CANCELLATION_REASONS.map((reason) => (
                  <div key={reason} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason} id={reason} />
                    <Label htmlFor={reason} className="text-sm cursor-pointer">
                      {reason}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
            
            {selectedReason === 'Other' && (
              <div className="space-y-2">
                <Label htmlFor="custom-reason">Please specify</Label>
                <Textarea
                  id="custom-reason"
                  placeholder="Tell us more about why you're cancelling..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  rows={3}
                />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Keep Order
            </Button>
            <Button
              onClick={handleReasonSubmit}
              disabled={!selectedReason}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Confirm Cancellation
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <div>
                Are you sure you want to cancel this order? This action cannot be undone.
              </div>
              <div className="bg-gray-50 p-3 rounded-lg text-sm">
                <div><strong>Order:</strong> #{order.id?.slice(-8) || 'N/A'}</div>
                <div><strong>Total:</strong> ₹{order.totalAmount.toLocaleString()}</div>
                <div><strong>Reason:</strong> {selectedReason === 'Other' ? customReason : selectedReason}</div>
              </div>
              <div className="text-sm text-gray-600">
                {order.paymentStatus === 'completed' && (
                  <p>💳 <strong>Refund:</strong> Your refund will be processed within 5-7 business days.</p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={isCancelling}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isCancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

// Quick cancel component for admin use
interface QuickCancelProps {
  order: Order
  onOrderCancelled?: () => void
}

export function QuickCancelButton({ order, onOrderCancelled }: QuickCancelProps) {
  const [isCancelling, setIsCancelling] = useState(false)
  
  const canCancel = order.status === 'pending' || order.status === 'processing'

  const handleQuickCancel = async () => {
    if (!canCancel) return
    
    setIsCancelling(true)
    try {
      await FirebaseOrdersService.cancelOrder(order.id!, 'Cancelled by admin')
      toast.success('Order cancelled successfully')
      if (onOrderCancelled) onOrderCancelled()
    } catch (error) {
      toast.error('Failed to cancel order')
    } finally {
      setIsCancelling(false)
    }
  }

  if (!canCancel) return null

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-red-600 border-red-200 hover:bg-red-50"
        >
          <XCircle className="h-3 w-3 mr-1" />
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel Order</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel order #{order.id?.slice(-8) || 'N/A'}?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>No, Keep Order</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleQuickCancel}
            disabled={isCancelling}
            className="bg-red-600 hover:bg-red-700"
          >
            {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
