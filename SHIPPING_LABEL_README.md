# Shipping Label Generator

## Overview

The Shipping Label Generator is a comprehensive PDF label extraction system for order delivery management. It allows administrators and customers to generate professional shipping labels for jewelry orders.

## Features

### 🏷️ Single Order Labels
- Generate individual shipping labels for specific orders
- Professional layout with company branding
- Customer shipping details and order information
- Product contents listing with SKU information
- Barcode simulation for tracking
- Download as PDF or print directly

### 📦 Batch Label Generation
- Generate multiple shipping labels in one PDF
- Bulk processing for order fulfillment
- Each label on a separate A4 page
- Efficient for large order volumes

### 🎨 Label Design
- **Size**: 100mm x 150mm (standard shipping label size)
- **Layout**: Professional jewelry industry standard
- **Elements**:
  - Company header with contact information
  - Order number and dates
  - Ship-to and ship-from addresses
  - Product contents with quantities
  - Handle with care instructions
  - Value declaration for insurance
  - Tracking barcode area

## Usage

### For Administrators

#### Admin Orders Page (`/admin/orders`)
1. **Individual Labels**: Click the shipping label button next to any processing/shipped/delivered order
2. **Batch Labels**: Use the "Generate X Labels" button to create labels for all qualifying orders
3. **Label Options**:
   - Download PDF
   - Print directly

#### Single Order View
- Shipping label generator appears for orders with status: processing, shipped, or delivered
- Located in the order header next to status badges

### For Customers

#### Order Detail Page (`/orders/[id]`)
- Customers can generate their own shipping labels for confirmed orders
- Useful for return shipping or record keeping

## Technical Implementation

### Core Components

#### `ShippingLabelService` (`/lib/services/shipping-label.ts`)
- **PDF Generation**: Uses jsPDF and html2canvas
- **Label Templates**: HTML-based templates with CSS styling
- **Batch Processing**: Handles multiple orders efficiently
- **Export Options**: Download PDF or print preview

#### `ShippingLabelGenerator` (`/components/admin/shipping-label-generator.tsx`)
- **UI Component**: Dropdown menu with label options
- **Variants**: Single order or batch processing
- **Toast Notifications**: User feedback for actions
- **Error Handling**: Graceful failure management

### Data Structure

```typescript
interface ShippingLabelData {
  orderId: string
  orderNumber: string          // Format: GS{8-digit-code}
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
    sku?: string              // Auto-generated from productId
  }>
  totalAmount: number
  weight?: string
  dimensions?: string
  createdAt: Date
}
```

### Label Template Features

1. **Header Section**
   - Global Saanvika branding
   - Company contact information
   - Professional appearance

2. **Order Information**
   - Order number (GS format)
   - Order date and label generation date
   - Total item count

3. **Address Sections**
   - Clear ship-to customer details
   - Ship-from company address
   - Phone numbers for contact

4. **Contents Listing**
   - Product names and quantities
   - SKU codes for tracking
   - Professional formatting

5. **Footer Information**
   - Handle with care instructions
   - Insurance value declaration
   - Tracking barcode area

## Dependencies

```json
{
  "jspdf": "^latest",
  "html2canvas": "^latest"
}
```

## Installation

```bash
npm install jspdf html2canvas
```

## Configuration

### Company Information
Update company details in `ShippingLabelService.COMPANY_INFO`:

```typescript
private static readonly COMPANY_INFO = {
  name: "Global Saanvika",
  address: "123 Jewelry Street, Artisan Quarter",
  city: "Mumbai, Maharashtra 400001",
  phone: "+91 98765 43210",
  email: "orders@globalsaanvika.com",
  website: "www.globalsaanvika.com"
}
```

## Best Practices

### When to Generate Labels
- **Processing Status**: Order is confirmed and ready for packaging
- **Shipped Status**: Order is dispatched and needs tracking
- **Delivered Status**: For customer records or returns

### Label Usage
- Print on standard 100mm x 150mm label paper
- Use thermal or laser printers for best quality
- Ensure clear printing for barcode readability
- Attach securely to packages

### Batch Processing
- Filter orders by status for efficiency
- Generate labels in order processing sequence
- Use for daily shipping operations
- Print in batches to save time

## Error Handling

- **Popup Blocked**: Instructions to allow popups
- **PDF Generation Failed**: Fallback to browser print
- **Network Issues**: Retry mechanisms
- **Invalid Order Data**: Validation checks

## Future Enhancements

1. **QR Code Integration**: Real tracking codes
2. **Carrier Integration**: Direct API connections
3. **Custom Templates**: Multiple label layouts
4. **Tracking Integration**: Real-time status updates
5. **Return Labels**: Automated return processing

## Security Considerations

- Customer data protection in PDF generation
- Secure download links with expiration
- Admin-only access to batch operations
- Order ownership verification

## Support

For issues or feature requests related to the shipping label system, please contact the development team or create an issue in the project repository.
