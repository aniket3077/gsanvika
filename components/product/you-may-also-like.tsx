"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star, ArrowRight } from 'lucide-react'
import { Product } from '@/types/product'
import { SuggestionsService } from '@/lib/services/suggestions'
import { cn } from '@/lib/utils/common'

interface YouMayAlsoLikeProps {
  currentProduct: Product
  maxItems?: number
  title?: string
}

export function YouMayAlsoLike({ 
  currentProduct, 
  maxItems = 4,
  title = "You may also like"
}: YouMayAlsoLikeProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true)
        const relatedProducts = await SuggestionsService.getRelatedProducts(
          currentProduct, 
          { limit: maxItems }
        )
        setProducts(relatedProducts)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [currentProduct, maxItems])

  if (loading) {
    return (
      <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(maxItems)].map((_, i) => (
            <div key={i} className="animate-pulse space-y-3">
              <div className="aspect-square bg-gray-800 rounded-lg"></div>
              <div className="space-y-2">
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
    <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <Link 
          href={`/category/${currentProduct.category}`}
          className="text-[#C4A484] hover:text-[#D4B494] text-sm font-medium flex items-center gap-1 transition-colors"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link 
            key={product.id} 
            href={`/product/${product.id}`}
            className="group"
          >
            <div className="space-y-3">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-800 group-hover:ring-2 group-hover:ring-[#C4A484]/30 transition-all">
                <Image
                  src={product.images?.[0] || product.imageUrl || '/placeholder.jpg'}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Discount Badge */}
                {product.comparePrice && (
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)}%
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <h4 className="font-medium text-white text-sm line-clamp-2 group-hover:text-[#C4A484] transition-colors">
                  {product.name}
                </h4>
                
                {/* Rating */}
                {product.averageRating && product.averageRating > 0 && (
                  <div className="flex items-center gap-1">
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
                  <span className="font-bold text-[#C4A484]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.comparePrice && (
                    <span className="text-xs text-gray-500 line-through">
                      ₹{product.comparePrice.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
