import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Order } from '@/lib/firebase/orders'

export interface ShippingLabelData {
  orderId: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  shippingAddress: {
    street: string
    city: string
    state: string
    pincode: string
  }
  items: Array<{
    productName: string
    quantity: number
    sku?: string
  }>
  totalAmount: number
  weight?: string
  dimensions?: string
  createdAt: Date
}

export class ShippingLabelService {
  private static readonly COMPANY_INFO = {
    name: "Global Saanvika",
    address: "123 Jewelry Street, Artisan Quarter",
    city: "Mumbai, Maharashtra 400001",
    phone: "+91 98765 43210",
    email: "orders@globalsaanvika.com",
    website: "www.globalsaanvika.com"
  }

  /**
   * Convert Order to ShippingLabelData
   */
  static orderToShippingLabel(order: Order): ShippingLabelData {
    return {
      orderId: order.id || '',
      orderNumber: `GS${order.id?.slice(-8).toUpperCase() || ''}`,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: order.shippingAddress,
      items: order.items.map(item => ({
        productName: item.productName,
        quantity: item.quantity,
        sku: item.productId.slice(-6).toUpperCase()
      })),
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
    }
  }

  /**
   * Generate shipping label HTML content
   */
  static generateLabelHTML(labelData: ShippingLabelData): string {
    const today = new Date().toLocaleDateString('en-IN')
    const orderDate = labelData.createdAt.toLocaleDateString('en-IN')
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Shipping Label - ${labelData.orderNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', sans-serif; 
            font-size: 12px; 
            line-height: 1.4;
            color: #000;
            background: #fff;
          }
          .label-container { 
            width: 100mm; 
            height: 150mm; 
            margin: 0 auto; 
            padding: 8mm;
            border: 2px solid #000;
            position: relative;
          }
          .header { 
            text-align: center; 
            border-bottom: 2px solid #000; 
            padding-bottom: 8px; 
            margin-bottom: 8px;
          }
          .company-name { 
            font-size: 16px; 
            font-weight: bold; 
            margin-bottom: 4px;
          }
          .company-details { 
            font-size: 10px; 
            color: #666;
          }
          .section { 
            margin-bottom: 8px; 
            padding: 4px;
            border: 1px solid #ddd;
          }
          .section-title { 
            font-weight: bold; 
            font-size: 11px; 
            margin-bottom: 4px;
            text-transform: uppercase;
            background: #f0f0f0;
            padding: 2px 4px;
          }
          .order-info { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 8px;
          }
          .order-number { 
            font-size: 14px; 
            font-weight: bold;
          }
          .address { 
            font-size: 11px; 
            line-height: 1.3;
          }
          .items-list { 
            font-size: 10px;
          }
          .item { 
            padding: 2px 0; 
            border-bottom: 1px dotted #ccc;
          }
          .footer { 
            position: absolute; 
            bottom: 8mm; 
            left: 8mm; 
            right: 8mm;
            text-align: center; 
            font-size: 10px; 
            border-top: 1px solid #000;
            padding-top: 4px;
          }
          .barcode-area {
            text-align: center;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            padding: 4px;
            background: #f9f9f9;
            border: 1px dashed #000;
            margin: 4px 0;
          }
          @media print {
            body { margin: 0; }
            .label-container { margin: 0; }
          }
        </style>
      </head>
      <body>
        <div class="label-container">
          <div class="header">
            <div class="company-name">${this.COMPANY_INFO.name}</div>
            <div class="company-details">
              ${this.COMPANY_INFO.address}<br>
              ${this.COMPANY_INFO.city}<br>
              ${this.COMPANY_INFO.phone} | ${this.COMPANY_INFO.email}
            </div>
          </div>

          <div class="order-info">
            <div>
              <strong>Order:</strong> ${labelData.orderNumber}<br>
              <strong>Date:</strong> ${orderDate}
            </div>
            <div style="text-align: right;">
              <strong>Label Date:</strong> ${today}<br>
              <strong>Items:</strong> ${labelData.items.reduce((sum, item) => sum + item.quantity, 0)}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Ship To:</div>
            <div class="address">
              <strong>${labelData.customerName}</strong><br>
              ${labelData.shippingAddress.street}<br>
              ${labelData.shippingAddress.city}, ${labelData.shippingAddress.state}<br>
              PIN: ${labelData.shippingAddress.pincode}<br>
              ${labelData.customerPhone ? `Phone: ${labelData.customerPhone}` : ''}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Ship From:</div>
            <div class="address">
              <strong>${this.COMPANY_INFO.name}</strong><br>
              ${this.COMPANY_INFO.address}<br>
              ${this.COMPANY_INFO.city}<br>
              Phone: ${this.COMPANY_INFO.phone}
            </div>
          </div>

          <div class="section">
            <div class="section-title">Contents:</div>
            <div class="items-list">
              ${labelData.items.map(item => `
                <div class="item">
                  <strong>${item.productName}</strong> 
                  (Qty: ${item.quantity})
                  ${item.sku ? ` - SKU: ${item.sku}` : ''}
                </div>
              `).join('')}
            </div>
          </div>

          <div class="barcode-area">
            <div>||||| |||| ||||| |||| |||||</div>
            <div>${labelData.orderNumber}</div>
          </div>

          <div class="footer">
            <strong>Handle with Care - Premium Jewelry</strong><br>
            Value: ₹${labelData.totalAmount.toLocaleString('en-IN')} | 
            Insured Package
          </div>
        </div>
      </body>
      </html>
    `
  }

  /**
   * Generate PDF from HTML content
   */
  static async generatePDF(labelData: ShippingLabelData): Promise<Blob> {
    const htmlContent = this.generateLabelHTML(labelData)
    
    // Create a temporary container
    const container = document.createElement('div')
    container.innerHTML = htmlContent
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '-9999px'
    document.body.appendChild(container)

    try {
      // Convert HTML to canvas
      const canvas = await html2canvas(container.querySelector('.label-container')!, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      })

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: [100, 150] // 100mm x 150mm label size
      })

      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 0, 0, 100, 150)

      return pdf.output('blob')
    } finally {
      // Clean up
      document.body.removeChild(container)
    }
  }

  /**
   * Download shipping label as PDF
   */
  static async downloadLabel(labelData: ShippingLabelData): Promise<void> {
    try {
      const pdfBlob = await this.generatePDF(labelData)
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `shipping-label-${labelData.orderNumber}.pdf`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Clean up
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating shipping label:', error)
      throw new Error('Failed to generate shipping label. Please try again.')
    }
  }

  /**
   * Print shipping label directly
   */
  static printLabel(labelData: ShippingLabelData): void {
    const htmlContent = this.generateLabelHTML(labelData)
    const printWindow = window.open('', '_blank')
    
    if (!printWindow) {
      throw new Error('Popup blocked - please allow popups for this site')
    }

    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()
    
    // Auto-print after a short delay
    setTimeout(() => {
      printWindow.print()
    }, 500)
  }

  /**
   * Generate multiple labels for batch processing
   */
  static async generateBatchLabels(orders: Order[]): Promise<Blob> {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    let isFirstPage = true

    for (const order of orders) {
      if (!isFirstPage) {
        pdf.addPage()
      }
      
      const labelData = this.orderToShippingLabel(order)
      const htmlContent = this.generateLabelHTML(labelData)
      
      // Create temporary container for this label
      const container = document.createElement('div')
      container.innerHTML = htmlContent
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '-9999px'
      document.body.appendChild(container)

      try {
        const canvas = await html2canvas(container.querySelector('.label-container')!, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          backgroundColor: '#ffffff'
        })

        const imgData = canvas.toDataURL('image/png')
        
        // Add label to PDF (centered on A4 page)
        const labelWidth = 100
        const labelHeight = 150
        const pageWidth = 210 // A4 width in mm
        const pageHeight = 297 // A4 height in mm
        const x = (pageWidth - labelWidth) / 2
        const y = (pageHeight - labelHeight) / 2
        
        pdf.addImage(imgData, 'PNG', x, y, labelWidth, labelHeight)
        
        isFirstPage = false
      } finally {
        document.body.removeChild(container)
      }
    }

    return pdf.output('blob')
  }

  /**
   * Download batch labels
   */
  static async downloadBatchLabels(orders: Order[]): Promise<void> {
    try {
      const pdfBlob = await this.generateBatchLabels(orders)
      
      const url = URL.createObjectURL(pdfBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `shipping-labels-batch-${new Date().toISOString().split('T')[0]}.pdf`
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating batch shipping labels:', error)
      throw new Error('Failed to generate batch shipping labels. Please try again.')
    }
  }
}
