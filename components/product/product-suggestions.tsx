"use client"

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Star, TrendingUp, Sparkles, Eye, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Product } from '@/types/product'
import { SuggestionsService } from '@/lib/services/suggestions'
import { cn } from '@/lib/utils/common'

interface ProductSuggestionsProps {
  currentProduct: Product
}

interface SuggestionSection {
  title: string
  products: Product[]
  icon: React.ReactNode
  loading: boolean
}

export function ProductSuggestions({ currentProduct }: ProductSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<{
    related: Product[]
    similarPrice: Product[]
    trending: Product[]
    featured: Product[]
    recentlyViewed: Product[]
  }>({
    related: [],
    similarPrice: [],
    trending: [],
    featured: [],
    recentlyViewed: []
  })
  
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        setLoading(true)
        
        // Get comprehensive suggestions
        const allSuggestions = await SuggestionsService.getProductSuggestions(currentProduct)
        
        // Get recently viewed products
        const recentlyViewed = SuggestionsService.getRecentlyViewedProducts(currentProduct.id, 4)
        
        // Add current product to recently viewed
        SuggestionsService.addToRecentlyViewed(currentProduct)
        
        setSuggestions({
          ...allSuggestions,
          recentlyViewed
        })
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestions()
  }, [currentProduct])

  const sections: SuggestionSection[] = [
    {
      title: "Related Products",
      products: suggestions.related,
      icon: <ShoppingBag className="h-5 w-5" />,
      loading
    },
    {
      title: "Similar Price Range",
      products: suggestions.similarPrice,
      icon: <Sparkles className="h-5 w-5" />,
      loading
    },
    {
      title: "Trending Now",
      products: suggestions.trending,
      icon: <TrendingUp className="h-5 w-5" />,
      loading
    },
    {
      title: "Featured Products",
      products: suggestions.featured,
      icon: <Star className="h-5 w-5" />,
      loading
    },
    ...(suggestions.recentlyViewed.length > 0 ? [{
      title: "Recently Viewed",
      products: suggestions.recentlyViewed,
      icon: <Eye className="h-5 w-5" />,
      loading: false
    }] : [])
  ]

  const visibleSections = sections.filter(section => section.products.length > 0 || section.loading)

  if (visibleSections.length === 0) {
    return null
  }

  return (
    <div className="mt-16 space-y-12">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-[#C4A484] mb-2">You Might Also Like</h2>
        <p className="text-gray-400">Discover more amazing products just for you</p>
      </div>

      {visibleSections.map((section, sectionIndex) => (
        <div key={section.title} className="space-y-6">
          {/* Section Header */}
          <div className="flex items-center gap-3">
            <div className="text-[#C4A484]">
              {section.icon}
            </div>
            <h3 className="text-xl font-semibold text-white">{section.title}</h3>
            <div className="flex-1 h-px bg-gradient-to-r from-[#C4A484]/20 to-transparent"></div>
          </div>

          {/* Products Grid */}
          {section.loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-square bg-gray-800 rounded-lg"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-800 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-800 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-800 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {section.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <Link href={`/product/${product.id}`} className="group">
      <div className="space-y-4">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-900 border border-gray-800 group-hover:border-[#C4A484]/30 transition-colors">
          <Image
            src={product.images?.[0] || product.imageUrl || '/placeholder.jpg'}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-all duration-300 group-hover:scale-105",
              imageLoaded ? "opacity-100" : "opacity-0"
            )}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Loading Placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-[#C4A484]/20 border-t-[#C4A484] rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Discount Badge */}
          {discount > 0 && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
              -{discount}%
            </div>
          )}
          
          {/* Quick View Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm text-black px-4 py-2 rounded-full text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform">
              Quick View
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h4 className="font-medium text-white group-hover:text-[#C4A484] transition-colors line-clamp-2 text-sm">
            {product.name}
          </h4>
          
          {/* Rating */}
          {product.averageRating && product.averageRating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
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
            <span className="font-bold text-[#C4A484] text-lg">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.comparePrice && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.comparePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          
          {/* Category */}
          <div className="text-xs text-gray-400 capitalize">
            {product.category.replace(/([A-Z])/g, ' $1').trim()}
          </div>
        </div>
      </div>
    </Link>
  )
}
