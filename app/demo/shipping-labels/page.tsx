import { ShippingLabelDemo } from '@/components/demo/shipping-label-demo'

export default function ShippingLabelDemoPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Shipping Label Generator Demo
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience our professional shipping label generation system. This demo shows 
            how orders are processed and labels are created for delivery tracking.
          </p>
        </div>
        
        <ShippingLabelDemo />
        
        <div className="mt-12 text-center">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Professional Layout</h3>
              <p className="text-gray-600 text-sm">
                Industry-standard 100mm x 150mm labels with all required shipping information
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Batch Processing</h3>
              <p className="text-gray-600 text-sm">
                Generate multiple labels at once for efficient order fulfillment operations
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-2">Order Tracking</h3>
              <p className="text-gray-600 text-sm">
                Integrated order numbers and barcodes for complete delivery traceability
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
