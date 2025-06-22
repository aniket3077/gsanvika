"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { SuggestionsService } from '@/lib/services/suggestions'
import { useCart } from '@/components/cart/cart-provider'
import { cn } from '@/lib/utils/common'
import { toast } from 'sonner'

interface QuickSuggestionsProps {
  currentProduct: Product
}

export function QuickSuggestions({ currentProduct }: QuickSuggestionsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { dispatch } = useCart()

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true)
        // Get a mix of related and similar price products
        const [related, similarPrice] = await Promise.all([
          SuggestionsService.getRelatedProducts(currentProduct, { limit: 2 }),
          SuggestionsService.getSimilarPriceProducts(currentProduct, { limit: 2 })
        ])
        
        // Combine and remove duplicates
        const combined = [...related, ...similarPrice]
        const unique = combined.filter((product, index, self) => 
          index === self.findIndex(p => p.id === product.id)
        ).slice(0, 3)
        
        setProducts(unique)
      } catch (error) {
        console.error('Error fetching quick suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [currentProduct])

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
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
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 bg-gray-800 rounded w-32 animate-pulse"></div>
        </div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-12 h-12 bg-gray-800 rounded"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-gray-800 rounded w-3/4"></div>
                <div className="h-3 bg-gray-800 rounded w-1/2"></div>
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
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
      <div className="flex items-center gap-2 mb-4">
        <Plus className="h-4 w-4 text-[#C4A484]" />
        <h4 className="text-sm font-medium text-[#C4A484]">Frequently bought together</h4>
      </div>
      
      <div className="space-y-3">
        {products.map((product) => (
          <Link 
            key={product.id}
            href={`/product/${product.id}`}
            className="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
          >
            {/* Product Image */}
            <div className="relative w-12 h-12 rounded overflow-hidden bg-gray-800 flex-shrink-0">
              <Image
                src={product.images?.[0] || product.imageUrl || '/placeholder.jpg'}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            
            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <h5 className="text-sm font-medium text-white group-hover:text-[#C4A484] transition-colors line-clamp-1">
                {product.name}
              </h5>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium text-[#C4A484]">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.averageRating && product.averageRating > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs text-gray-400">
                      {product.averageRating.toFixed(1)}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Quick Add Button */}
            <Button
              size="sm"
              variant="outline"
              className="h-8 w-8 p-0 border-[#C4A484]/20 hover:border-[#C4A484] hover:bg-[#C4A484]/10"
              onClick={(e) => handleQuickAdd(product, e)}
            >
              <Plus className="h-3 w-3 text-[#C4A484]" />
            </Button>
          </Link>
        ))}
      </div>
      
      {/* View More Link */}
      <div className="mt-3 pt-3 border-t border-gray-800">
        <Link 
          href={`/category/${currentProduct.category}`}
          className="text-xs text-[#C4A484] hover:text-[#D4B494] transition-colors"
        >
          View more in {currentProduct.category} →
        </Link>
      </div>
    </div>
  )
}
