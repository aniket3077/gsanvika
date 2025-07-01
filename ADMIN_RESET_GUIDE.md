# Admin Dashboard Data Reset Guide

## Overview
The admin dashboard now includes comprehensive data reset functionality to help you manage and clean up your Firebase collections.

## Available Reset Options

### 1. CLI Commands (Command Line)
```bash
# Reset all admin data
npm run reset-admin-data

# Reset specific data types
npm run reset-products
npm run reset-orders  
npm run reset-customers
```

### 2. Web Interface
Navigate to the admin dashboard and click on "Data Management" to access the web-based reset interface.

**URL:** `/admin/data-reset`

## Features

### Data Overview
- View current count of all data types (products, orders, customers, users)
- Real-time data count updates
- Last updated timestamp

### Selective Reset
- Reset individual data types (products, orders, customers, users)
- Confirmation prompts for safety
- Individual progress tracking

### Complete Reset
- Reset all admin dashboard data at once
- Enhanced warning prompts
- Comprehensive logging

### Safety Features
- Confirmation dialogs before any destructive action
- Data count display before reset
- Progress notifications
- Error handling and recovery

## Data Types Managed

1. **Products** - All product listings and inventory
2. **Orders** - Customer orders and transactions  
3. **Customers** - Customer profiles and information
4. **Users** - User accounts and authentication data
5. **Reviews** - Product reviews and ratings
6. **Categories** - Product categories
7. **Analytics** - Usage analytics data
8. **Notifications** - System notifications

## Usage Instructions

### CLI Usage
1. Open terminal in the project root
2. Run the desired reset command
3. Wait for confirmation countdown (3-5 seconds)
4. Press Ctrl+C to cancel if needed

### Web Interface Usage
1. Login as admin
2. Go to Admin Dashboard → Data Management
3. Review current data counts
4. Choose specific reset or complete reset
5. Confirm the action in the dialog
6. Wait for completion notification

## Important Notes

⚠️ **WARNING**: All reset operations are permanent and cannot be undone.

- Always backup important data before resetting
- The dashboard statistics will immediately reflect changes
- Collections that don't exist will be skipped safely
- Operations are logged to the console for debugging

## Troubleshooting

### Common Issues
1. **Permission Errors**: Ensure you're logged in as admin
2. **Firebase Connection**: Check your Firebase configuration
3. **Build Errors**: Run `npm run build` to check for issues

### Getting Help
- Check browser console for detailed error messages
- Review Firebase security rules if operations fail
- Ensure proper authentication and admin privileges

## Development

The reset functionality is built with:
- Firebase Firestore batch operations for efficiency
- React components with confirmation dialogs
- TypeScript for type safety
- Proper error handling and user feedback

### File Structure
```
lib/services/admin-data-reset.ts      # Core reset service
components/admin/data-reset-panel.tsx # React UI component  
app/admin/data-reset/page.tsx         # Admin page
scripts/reset-admin-data.ts           # CLI script
```
