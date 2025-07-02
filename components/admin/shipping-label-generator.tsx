"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Download, FileText, Package, ChevronDown } from 'lucide-react'
import { Order } from '@/lib/firebase/orders'
import { ShippingLabelService } from '@/lib/services/shipping-label'
import { toast } from 'sonner'

interface ShippingLabelGeneratorProps {
  order?: Order
  orders?: Order[]
  variant?: 'single' | 'batch'
  size?: 'sm' | 'default' | 'lg'
}

export function ShippingLabelGenerator({ 
  order, 
  orders = [], 
  variant = 'single',
  size = 'default'
}: ShippingLabelGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showBatchDialog, setShowBatchDialog] = useState(false)

  const handleSingleDownload = async () => {
    if (!order) return
    
    setIsGenerating(true)
    try {
      const labelData = ShippingLabelService.orderToShippingLabel(order)
      await ShippingLabelService.downloadLabel(labelData)
      toast.success('Shipping label downloaded successfully')
    } catch (error) {
      console.error('Error downloading shipping label:', error)
      toast.error('Failed to download shipping label')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSinglePrint = async () => {
    if (!order) return
    
    try {
      const labelData = ShippingLabelService.orderToShippingLabel(order)
      ShippingLabelService.printLabel(labelData)
      toast.success('Shipping label opened for printing')
    } catch (error) {
      console.error('Error printing shipping label:', error)
      toast.error('Failed to open shipping label for printing')
    }
  }

  const handleBatchDownload = async () => {
    if (orders.length === 0) return
    
    setIsGenerating(true)
    try {
      await ShippingLabelService.downloadBatchLabels(orders)
      toast.success(`Downloaded ${orders.length} shipping labels`)
    } catch (error) {
      console.error('Error downloading batch shipping labels:', error)
      toast.error('Failed to download batch shipping labels')
    } finally {
      setIsGenerating(false)
      setShowBatchDialog(false)
    }
  }

  if (variant === 'single' && order) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            size={size}
            disabled={isGenerating}
          >
            <Package className="h-4 w-4 mr-2" />
            {isGenerating ? 'Generating...' : 'Shipping Label'}
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleSingleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSinglePrint}>
            <FileText className="h-4 w-4 mr-2" />
            Print Label
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (variant === 'batch' && orders.length > 0) {
    return (
      <>
        <Button 
          variant="outline" 
          size={size}
          onClick={() => setShowBatchDialog(true)}
          disabled={isGenerating}
        >
          <Package className="h-4 w-4 mr-2" />
          {isGenerating ? 'Generating...' : `Generate ${orders.length} Labels`}
        </Button>

        <AlertDialog open={showBatchDialog} onOpenChange={setShowBatchDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Generate Batch Shipping Labels</AlertDialogTitle>
              <AlertDialogDescription>
                This will generate shipping labels for {orders.length} orders. 
                Each label will be on a separate page in the PDF.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleBatchDownload}
                disabled={isGenerating}
              >
                {isGenerating ? 'Generating...' : 'Download PDF'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return null
}

// Shipping Label Preview Component
interface ShippingLabelPreviewProps {
  order: Order
  className?: string
}

export function ShippingLabelPreview({ order, className = '' }: ShippingLabelPreviewProps) {
  const labelData = ShippingLabelService.orderToShippingLabel(order)
  const htmlContent = ShippingLabelService.generateLabelHTML(labelData)

  return (
    <div className={`border rounded-lg p-4 bg-white ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Shipping Label Preview</h3>
        <ShippingLabelGenerator order={order} size="sm" />
      </div>
      <div 
        className="border border-gray-300 bg-white w-[300px] h-[450px] scale-[0.6] origin-top-left overflow-hidden"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </div>
  )
}
