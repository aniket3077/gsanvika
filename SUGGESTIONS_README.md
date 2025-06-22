# Product Suggestions System

This system provides comprehensive product suggestions on product pages with multiple types of recommendations.

## Components

### 1. ProductSuggestions (Main Component)
Comprehensive suggestions with multiple sections:
- Related Products (same category)
- Similar Price Range
- Trending Products
- Featured Products
- Recently Viewed Products

```tsx
import { ProductSuggestions } from '@/components/product/product-suggestions'

<ProductSuggestions currentProduct={product} />
```

### 2. QuickSuggestions (Inline Component)
Compact "frequently bought together" style suggestions shown inline with product details.

```tsx
import { QuickSuggestions } from '@/components/product/quick-suggestions'

<QuickSuggestions currentProduct={product} />
```

### 3. YouMayAlsoLike (Card Grid)
Clean card grid layout for related products with customizable appearance.

```tsx
import { YouMayAlsoLike } from '@/components/product/you-may-also-like'

<YouMayAlsoLike 
  currentProduct={product} 
  maxItems={4}
  title="You may also like"
/>
```

### 4. CompactSuggestions (Sidebar Style)
Compact list-style suggestions perfect for sidebars or tight spaces.

```tsx
import { CompactSuggestions } from '@/components/product/compact-suggestions'

<CompactSuggestions 
  currentProduct={product}
  title="Related Products"
  maxItems={3}
  showAddToCart={true}
/>
```

### 5. RelatedProducts (Enhanced)
The existing enhanced related products component with carousel functionality.

```tsx
import { RelatedProducts } from '@/components/product/related-products'

<RelatedProducts 
  currentProductId={product.id}
  category={product.category}
/>
```

## Services

### SuggestionsService
Handles all product suggestion logic:

```tsx
import { SuggestionsService } from '@/lib/services/suggestions'

// Get all types of suggestions
const suggestions = await SuggestionsService.getProductSuggestions(currentProduct)

// Get specific types
const related = await SuggestionsService.getRelatedProducts(currentProduct, { limit: 8 })
const similarPrice = await SuggestionsService.getSimilarPriceProducts(currentProduct, { limit: 6 })
const trending = await SuggestionsService.getTrendingProducts(currentProduct, { limit: 6 })
const featured = await SuggestionsService.getFeaturedProducts(currentProduct, { limit: 4 })

// Recently viewed products (localStorage)
const recentlyViewed = SuggestionsService.getRecentlyViewedProducts(currentProduct.id, 4)
```

## Features

### 🎯 Multiple Suggestion Types
- **Related Products**: Same category products
- **Similar Price Range**: Products within ±30% price range
- **Trending Products**: Most reviewed and highest rated
- **Featured Products**: Curated featured items
- **Recently Viewed**: Browser history-based suggestions

### 🚀 Performance Optimized
- Lazy loading with skeleton states
- Efficient Firestore queries
- Client-side caching for recently viewed
- Minimal re-renders with proper memoization

### 📱 Responsive Design
- Mobile-first approach
- Touch-friendly interfaces
- Optimized for all screen sizes
- Smooth animations and transitions

### 🛒 E-commerce Features
- Quick add to cart functionality
- Price comparison with discounts
- Star ratings display
- Stock status indicators
- Share functionality integration

### 🎨 Customizable Styling
- Dark theme optimized
- Brand color integration (#C4A484)
- Multiple layout options
- CSS custom properties support

## Implementation in Product Page

The suggestions are automatically added to the product page in the following locations:

1. **QuickSuggestions**: After product description
2. **ProductSuggestions**: After reviews section

```tsx
// In product-client.tsx
{/* Product Description */}
<div className="prose prose-invert max-w-none">
  <p>{product.description}</p>
</div>

{/* Quick Suggestions */}
<div className="mt-6">
  <QuickSuggestions currentProduct={product} />
</div>

{/* Reviews Section */}
<div className="mt-16">
  <ReviewsList productId={id} />
</div>

{/* Product Suggestions */}
<div className="mt-16">
  <ProductSuggestions currentProduct={product} />
</div>
```

## Styling

Custom CSS classes are available in `styles/suggestions.css`:

- `.line-clamp-1`, `.line-clamp-2`, `.line-clamp-3`: Text truncation
- `.suggestion-scroll`: Smooth scrolling for carousels
- `.product-card-hover`: Enhanced hover effects
- `.gradient-border`: Premium border effects
- `.suggestion-skeleton`: Loading animations

## Browser Support

- **Recently Viewed**: Requires localStorage (fallback: empty array)
- **Native Sharing**: Requires Web Share API (fallback: copy link)
- **Smooth Scrolling**: CSS scroll-behavior support
- **Backdrop Blur**: Modern browsers (graceful degradation)

## Performance Tips

1. Use appropriate `maxItems` limits based on layout
2. Consider lazy loading for below-fold suggestions
3. Cache frequently accessed product data
4. Optimize images with Next.js Image component
5. Use skeleton states for better perceived performance

## Accessibility

- Proper ARIA labels and roles
- Keyboard navigation support
- Screen reader friendly
- High contrast ratios
- Focus management

## SEO Benefits

- Related product links improve internal linking
- Increased page engagement time
- Better product discovery
- Cross-selling opportunities
- Enhanced user experience metrics
