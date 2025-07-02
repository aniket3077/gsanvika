"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, Truck, MapPin } from 'lucide-react'
import { ShippingLabelGenerator } from '@/components/admin/shipping-label-generator'
import { Order } from '@/lib/firebase/orders'

// Demo order data for demonstration
const demoOrder: Order = {
  id: 'demo_order_12345678',
  customerName: 'Priya Sharma',
  customerEmail: 'priya.sharma@example.com',
  customerPhone: '+91 98765 43210',
  shippingAddress: {
    street: '123 Rose Garden, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560001'
  },
  items: [
    {
      productId: 'ruby_pendant_001',
      productName: 'Elegant Ruby Heart Pendant',
      quantity: 1,
      price: 15999,
      image: '/placeholder-jewelry.jpg'
    },
    {
      productId: 'gold_chain_002',
      productName: 'Gold Plated Chain (18 inch)',
      quantity: 1,
      price: 3999,
      image: '/placeholder-jewelry.jpg'
    }
  ],
  totalAmount: 19998,
  status: 'processing',
  paymentStatus: 'completed',
  paymentMethod: 'razorpay',
  createdAt: new Date('2025-01-15T10:30:00'),
  updatedAt: new Date('2025-01-15T10:30:00'),
  notes: 'Handle with extra care - premium jewelry'
}

export function ShippingLabelDemo() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Shipping Label Generator Demo
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Demo Order Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Order ID:</span> {demoOrder.id}
            </div>
            <div>
              <span className="font-medium">Customer:</span> {demoOrder.customerName}
            </div>
            <div>
              <span className="font-medium">Status:</span> 
              <Badge className="ml-2 bg-blue-100 text-blue-800">
                {demoOrder.status}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Payment:</span> 
              <Badge className="ml-2 bg-green-100 text-green-800">
                {demoOrder.paymentStatus}
              </Badge>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Shipping Address
          </h3>
          <p className="text-sm">
            {demoOrder.customerName}<br />
            {demoOrder.shippingAddress.street}<br />
            {demoOrder.shippingAddress.city}, {demoOrder.shippingAddress.state} {demoOrder.shippingAddress.pincode}
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Order Items
          </h3>
          <div className="space-y-2">
            {demoOrder.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>{item.productName} (x{item.quantity})</span>
                <span>₹{item.price.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t pt-2 font-semibold flex justify-between">
              <span>Total:</span>
              <span>₹{demoOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">Ready for Shipping</span>
          </div>
          <ShippingLabelGenerator order={demoOrder} />
        </div>

        <div className="bg-blue-50 p-3 rounded-lg text-sm">
          <p className="font-medium text-blue-800 mb-1">✨ Try the Label Generator!</p>
          <p className="text-blue-700">
            Click the "Shipping Label" button above to see how professional shipping labels 
            are generated for each order. You can download as PDF or print directly.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
