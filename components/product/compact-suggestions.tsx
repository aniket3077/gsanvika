"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { SuggestionsService } from '@/lib/services/suggestions'
import { useCart } from '@/components/cart/cart-provider'
import { cn } from '@/lib/utils/common'
import { toast } from 'sonner'

interface CompactSuggestionsProps {
  currentProduct: Product
  title?: string
  maxItems?: number
  showAddToCart?: boolean
}

export function CompactSuggestions({ 
  currentProduct, 
  title = "Related Products",
  maxItems = 3,
  showAddToCart = false
}: CompactSuggestionsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { dispatch } = useCart()

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true)
        const suggestions = await SuggestionsService.getRelatedProducts(
          currentProduct, 
          { limit: maxItems }
        )
        setProducts(suggestions)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [currentProduct, maxItems])

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    try {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl || product.images?.[0] || '/placeholder.jpg',
          category: product.category,
          quantity: 1
        }
      })
      toast.success(`${product.name} added to cart`)
    } catch (error) {
      toast.error('Failed to add item to cart')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <div className="space-y-3">
          {[...Array(maxItems)].map((_, i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="w-16 h-16 bg-gray-800 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
                <div className="h-3 bg-gray-800 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="group">
            <Link href={`/product/${product.id}`} className="flex gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors">
              {/* Product Image */}
              <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-800 flex-shrink-0">
                <Image
                  src={product.images?.[0] || product.imageUrl || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
                {product.comparePrice && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                    -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-white text-sm line-clamp-2 group-hover:text-[#C4A484] transition-colors mb-1">
                  {product.name}
                </h4>
                
                {/* Rating */}
                {product.averageRating && product.averageRating > 0 && (
                  <div className="flex items-center gap-1 mb-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            'h-3 w-3',
                            i < Math.floor(product.averageRating || 0)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-600'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">
                      ({product.totalReviews || 0})
                    </span>
                  </div>
                )}
                
                {/* Price */}
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-[#C4A484] text-sm">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.comparePrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹{product.comparePrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              {/* Add to Cart Button */}
              {showAddToCart && (
                <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 border-[#C4A484]/20 hover:border-[#C4A484] hover:bg-[#C4A484]/10"
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    <ShoppingCart className="h-3 w-3 text-[#C4A484]" />
                  </Button>
                </div>
              )}
            </Link>
          </div>
        ))}
      </div>
      
      {/* View More Link */}
      <div className="pt-2 border-t border-gray-800">
        <Link 
          href={`/category/${currentProduct.category}`}
          className="text-sm text-[#C4A484] hover:text-[#D4B494] transition-colors flex items-center gap-1"
        >
          View all in {currentProduct.category.replace(/([A-Z])/g, ' $1').trim()} →
        </Link>
      </div>
    </div>
  )
}
