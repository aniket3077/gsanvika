"use client"

import React, { useEffect, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { ShoppingCart, Check, Heart, ChevronLeft, Tag, Send, Plus, Minus, Star, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCart } from '@/components/cart/cart-provider'
import { Product } from '@/types/product'
import { ProductImages } from '@/components/product/product-images'
import { ReviewsList } from '@/components/product/reviews-list'
import { ProductSuggestions } from '@/components/product/product-suggestions'
import { cn } from '@/lib/utils/common'
import { ProductService } from '@/lib/firebase/products'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface ProductClientProps {
  id: string
  initialData?: Product | null
}

export default function ProductClientNew({ id, initialData }: ProductClientProps) {
  const router = useRouter()
  const { dispatch } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [product, setProduct] = useState<Product | null>(initialData || null)
  const [loading, setLoading] = useState(!initialData)
  const [isWishlist, setIsWishlist] = useState(false)
  const [showMoreDetails, setShowMoreDetails] = useState(false)

  useEffect(() => {
    if (!initialData) {
      const loadProduct = async () => {
        try {
          setLoading(true)
          const data = await ProductService.getProduct(id)
          if (data) {
            setProduct(data)
          } else {
            setProduct(null)
          }
        } catch (error) {
          console.error('Error loading product:', error)
          toast.error('Failed to load product details', { description: 'Please try again later' })
          setProduct(null)
        } finally {
          setLoading(false)
        }
      }
      loadProduct()
    }
  }, [id, initialData])

  const handleAddToCart = () => {
    if (!product) return
    
    try {
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
          category: product.category,
          quantity
        }
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
      toast.success(`${product.name} has been added to your cart.`)
    } catch (error) {
      toast.error('Failed to add item to cart. Please try again.')
    }
  }

  const handleQuantityChange = (newQuantity: number) => {
    if (product?.stockQuantity && newQuantity > 0 && newQuantity <= product.stockQuantity) {
      setQuantity(newQuantity)
    }
  }

  const handleBuyNow = () => {
    if (!product) return
    
    try {
      // First add to cart
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.imageUrl,
          category: product.category,
          quantity
        }
      })
      
      // Then redirect to checkout
      router.push('/checkout')
      toast.success('Redirecting to checkout...')
    } catch (error) {
      toast.error('Failed to proceed to checkout. Please try again.')
    }
  }

  // Share functionality
  const handleShare = async () => {
    if (!product) return

    const shareData = {
      title: product.name,
      text: `Check out this amazing ${product.category}: ${product.name}`,
      url: window.location.href,
    }

    if (navigator.share) {
      try {
        await navigator.share(shareData)
        toast.success('Product shared successfully!')
      } catch (error) {
        console.log('Share cancelled or failed:', error)
      }
    } else {
      handleCopyLink()
    }
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        toast.success('Product link copied to clipboard!')
      })
      .catch(() => {
        toast.error('Failed to copy link')
      })
  }

  const handleToggleFavorite = () => {
    const newWishlistState = !isWishlist
    setIsWishlist(newWishlistState)
    
    if (newWishlistState) {
      toast.success(`${product?.name} added to favorites!`, {
        description: 'You can find it in your wishlist'
      })
    } else {
      toast.success(`${product?.name} removed from favorites`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white relative overflow-hidden">
        {/* Elegant background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent opacity-30"></div>
        <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_rgba(196,164,132,0.03)_50%,_transparent_75%)] bg-[size:60px_60px]"></div>
        
        <div className="relative animate-pulse max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <div className="h-8 w-40 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div className="space-y-6">
              <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-700 rounded-3xl shadow-2xl"></div>
              <div className="grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="aspect-square bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl"></div>
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-3xl p-10 space-y-6">
                <div className="h-12 w-3/4 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl"></div>
                <div className="h-8 w-32 bg-gradient-to-r from-[#C4A484]/30 to-[#B39479]/30 rounded-full"></div>
                <div className="h-16 w-full bg-gradient-to-r from-gray-700 to-gray-600 rounded-2xl"></div>
              </div>
              <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/40 rounded-3xl p-10 space-y-4">
                <div className="h-16 w-48 bg-gradient-to-r from-[#C4A484]/30 to-[#B39479]/30 rounded-2xl"></div>
                <div className="h-8 w-2/3 bg-gradient-to-r from-gray-700 to-gray-600 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
        <Button onClick={() => router.push('/')}>Go Back Home</Button>
      </div>
    </div>
  }

  const discount = product.comparePrice 
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white relative overflow-hidden">
      {/* Elegant background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent opacity-30"></div>
      <div className="absolute inset-0 bg-[linear-gradient(45deg,_transparent_25%,_rgba(196,164,132,0.03)_50%,_transparent_75%)] bg-[size:60px_60px]"></div>
      
      {/* Container with proper padding and max-width */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <button 
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8"
        >
          <ChevronLeft className="h-5 w-5" />
          <span>Back to Collection</span>
        </button>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Left Column - Images */}
          <div className="space-y-6">
            <div className="relative">
              <ProductImages images={product.images || []} name={product.name} />
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="space-y-6">
            {/* Product Header */}
            <div className="py-6">
              
              <div className="flex items-start justify-between gap-6 mb-6">
                <div className="flex-1">
                  <h1 className="text-xl lg:text-2xl font-semibold text-white mb-4">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="bg-gray-700 text-gray-300 px-3 py-1 text-sm rounded">
                      {product.category}
                    </span>
                    {product.featured && (
                      <span className="bg-yellow-600 text-black px-3 py-1 text-sm rounded">
                        ⭐ Featured
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons - Share & Favorite */}
                <div className="flex items-center gap-2">
                  {/* Favorite Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-10 w-10 transition-all duration-200",
                      isWishlist 
                        ? "text-red-500 hover:text-red-400 bg-red-500/10 hover:bg-red-500/20" 
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    )}
                    onClick={handleToggleFavorite}
                    title={isWishlist ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={cn(
                      "h-5 w-5 transition-all duration-200",
                      isWishlist ? "fill-red-500 text-red-500 scale-110" : "text-gray-400"
                    )} />
                  </Button>

                  {/* Share Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-gray-400 hover:text-white h-10 w-10 hover:bg-gray-700/50"
                        title="Share this product"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border-gray-600">
                      <DropdownMenuItem onClick={handleShare} className="text-white hover:bg-gray-700">
                        <Send className="mr-2 h-4 w-4" />
                        Share Product
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Rating Section */}
              {product.averageRating && (
                <div className="flex items-center gap-4 py-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-4 w-4",
                          i < Math.floor(product.averageRating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-600"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-yellow-400">
                    {product.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-300 text-sm">
                    ({product.totalReviews || 0} reviews)
                  </span>
                </div>
              )}
            </div>

            {/* Pricing */}
            <div className="py-6">
              <div className="space-y-3">
                <p className="text-gray-400 text-sm">Price</p>
                <div className="flex items-baseline gap-4 flex-wrap">
                  <span className="text-2xl font-semibold text-[#C4A484]">
                    ₹{product.price.toLocaleString()}
                  </span>
                  {product.comparePrice && (
                    <>
                      <span className="text-lg text-gray-500 line-through">
                        ₹{product.comparePrice.toLocaleString()}
                      </span>
                      <span className="bg-green-600 text-white px-2 py-1 text-sm rounded">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>
                
                {product.comparePrice && (
                  <div className="pt-2">
                    <span className="text-green-400 text-sm">
                      💰 Save ₹{(product.comparePrice - product.price).toLocaleString()} on this piece
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Stock & Quantity */}
            <div className="py-6">
              
              {/* Stock Status */}
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  "h-3 w-3 rounded-full",
                  product.inStock ? "bg-green-500" : "bg-red-500"
                )} />
                <span className={cn(
                  "text-sm font-medium",
                  product.inStock ? "text-green-400" : "text-red-400"
                )}>
                  {product.inStock ? "✓ Available in Stock" : "✗ Currently Unavailable"}
                </span>
                {product.stockQuantity && product.stockQuantity <= 10 && (
                  <span className="ml-auto text-orange-400 text-xs">
                    ⚠️ Only {product.stockQuantity} pieces left
                  </span>
                )}
              </div>

              {/* Quantity Selector */}
              <div className="space-y-3">
                <label className="text-sm text-gray-300">Select Quantity:</label>
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-10 w-10 border border-gray-600 hover:bg-gray-700 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <div className="w-16 text-center text-lg font-medium bg-gray-800 border border-gray-600 rounded px-4 py-2">
                    {quantity}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={product.stockQuantity ? quantity >= product.stockQuantity : false}
                    className="h-10 w-10 border border-gray-600 hover:bg-gray-700 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="py-6">
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="h-12 bg-gradient-to-r from-[#C4A484] to-[#B39479] hover:from-[#B39479] hover:to-[#A08568] text-black font-medium text-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    {added ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </Button>
                  
                  <Button
                    className="h-12 bg-gradient-to-r from-orange-600 to-red-600 hover:from-red-600 hover:to-orange-700 text-white font-medium text-base rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                  >
                    <span>Buy Now</span>
                  </Button>
                </div>
                
                {!product.inStock && (
                  <div className="text-center py-2">
                    <p className="text-red-400 text-sm">This piece is currently out of stock</p>
                  </div>
                )}
                
                <div className="text-center space-y-2">
                  <p className="text-gray-400 text-sm">🔒 Secure Payment • 📦 Free Shipping • 🔄 30-Day Returns</p>
                  <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                    <span>💎 Authenticity Guaranteed</span>
                    <span>•</span>
                    <span>✨ Premium Quality</span>
                    <span>•</span>
                    <span>🎁 Gift Wrapped</span>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>

        {/* Product Information */}
        <div className="space-y-6 mb-16">
          {/* Basic Product Information */}
          <div className="py-4">
            <h2 className="text-sm text-gray-400 mb-3">
              Product Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {(product as any).baseMaterial && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Base Material: </span>
                  <span className="text-gray-300 text-xs">{(product as any).baseMaterial || product.material}</span>
                </div>
              )}
              {(product as any).productColor && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Product Color: </span>
                  <span className="text-gray-300 text-xs">{(product as any).productColor}</span>
                </div>
              )}
              {((product as any).modelNumber || product.sku) && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Model Number: </span>
                  <span className="text-gray-300 text-xs">{(product as any).modelNumber || product.sku}</span>
                </div>
              )}
              {(product as any).occasion && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Occasion: </span>
                  <span className="text-gray-300 text-xs">{(product as any).occasion}</span>
                </div>
              )}
              {(product as any).chainIncluded && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Chain Included: </span>
                  <span className="text-gray-300 text-xs">{(product as any).chainIncluded}</span>
                </div>
              )}
              {(product as any).collection && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Collection: </span>
                  <span className="text-gray-300 text-xs">{(product as any).collection}</span>
                </div>
              )}
              {(product as any).netQuantity && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Net Quantity: </span>
                  <span className="text-gray-300 text-xs">{(product as any).netQuantity}</span>
                </div>
              )}
              {(product as any).packOf && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Pack of: </span>
                  <span className="text-gray-300 text-xs">{(product as any).packOf}</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="py-4">
            <h2 className="text-sm text-gray-400 mb-3">
              Product Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {(product as any).type && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Type: </span>
                  <span className="text-gray-300 text-xs">{(product as any).type}</span>
                </div>
              )}
              {(product as any).highlights && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Highlights: </span>
                  <span className="text-gray-300 text-xs">{(product as any).highlights}</span>
                </div>
              )}
              {(product as any).locketType && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Locket Type: </span>
                  <span className="text-gray-300 text-xs">{(product as any).locketType}</span>
                </div>
              )}
              {(product as any).photoInsert && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Photo Insert: </span>
                  <span className="text-gray-300 text-xs">{(product as any).photoInsert}</span>
                </div>
              )}
              {(product as any).claspType && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Clasp Type: </span>
                  <span className="text-gray-300 text-xs">{(product as any).claspType}</span>
                </div>
              )}
              {(product as any).finish && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Finish: </span>
                  <span className="text-gray-300 text-xs">{(product as any).finish}</span>
                </div>
              )}
              {(product as any).otherFeatures && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Other Features: </span>
                  <span className="text-gray-300 text-xs">{(product as any).otherFeatures}</span>
                </div>
              )}
              {((product as any).pendantWeight || product.weight) && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Pendant Weight: </span>
                  <span className="text-gray-300 text-xs">{(product as any).pendantWeight || product.weight}</span>
                </div>
              )}
            </div>
            {product.description && (
              <div className="mt-4 pt-4 border-t border-gray-700/30">
                <span className="text-gray-500 text-xs">Description: </span>
                <span className="text-gray-300 text-xs">{product.description}</span>
              </div>
            )}
          </div>

          {/* More Details Toggle Button */}
          <div className="flex justify-center">
            <Button
              onClick={() => setShowMoreDetails(!showMoreDetails)}
              variant="outline"
              className="h-10 px-6 bg-gray-800/60 border-gray-600/40 text-gray-300 hover:bg-gray-700/60 hover:border-gray-500/60 transition-all duration-300 rounded-lg"
            >
              {showMoreDetails ? (
                <>
                  <ChevronUp className="h-4 w-4 mr-2" />
                  <span className="text-sm">Show Less Details</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 mr-2" />
                  <span className="text-sm">Show More Details</span>
                </>
              )}
            </Button>
          </div>

          {/* Collapsible Detailed Sections */}
          {showMoreDetails && (
            <div className="space-y-6 animate-in fade-in-0 slide-in-from-top-4 duration-500">

          {/* Chain Features */}
          {((product as any).chainMaterial || (product as any).chainType || (product as any).chainFinish || 
            (product as any).chainPlating || (product as any).chainLength || (product as any).chainWeight || 
            (product as any).chainHeight || (product as any).chainThickness) && (
          <div className="py-4">
            <h2 className="text-sm text-gray-400 mb-3">
              Chain Features
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {(product as any).chainMaterial && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Chain Material: </span>
                  <span className="text-gray-300 text-xs">{(product as any).chainMaterial}</span>
                </div>
              )}
              {(product as any).chainType && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Chain Type: </span>
                  <span className="text-gray-300 text-xs">{(product as any).chainType}</span>
                </div>
              )}
              {(product as any).chainFinish && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Chain Finish: </span>
                  <span className="text-gray-300 text-xs">{(product as any).chainFinish}</span>
                </div>
              )}
              {(product as any).chainPlating && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Chain Plating: </span>
                  <span className="text-gray-300 text-xs">{(product as any).chainPlating}</span>
                </div>
              )}
              {(product as any).chainLength && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Chain Length: </span>
                  <span className="text-gray-300 text-xs">{(product as any).chainLength}</span>
                </div>
              )}
              {(product as any).chainWeight && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Chain Weight: </span>
                  <span className="text-gray-300 text-xs">{(product as any).chainWeight}</span>
                </div>
              )}
              {(product as any).chainHeight && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Chain Height: </span>
                  <span className="text-gray-300 text-xs">{(product as any).chainHeight}</span>
                </div>
              )}
              {(product as any).chainThickness && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Chain Thickness: </span>
                  <span className="text-gray-300 text-xs">{(product as any).chainThickness}</span>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Earrings Details */}
          {((product as any).earringsIncluded || (product as any).earringsDetail) && (
          <div className="py-4">
            <h2 className="text-sm text-gray-400 mb-3">
              Earrings Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {(product as any).earringsIncluded && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Earrings Included: </span>
                  <span className="text-gray-300 text-xs">{(product as any).earringsIncluded}</span>
                </div>
              )}
              {(product as any).earringsDetail && (
                <div className="py-1">
                  <span className="text-gray-500 text-xs">Earrings Detail: </span>
                  <span className="text-gray-300 text-xs">{(product as any).earringsDetail}</span>
                </div>
              )}
            </div>
          </div>
          )}

          {/* Ruby Features */}
          {((product as any).rubyColor || (product as any).rubyClarity || (product as any).rubyShape || (product as any).rubyType || (product as any).rubySetting || (product as any).rubyWeight || (product as any).rubyWidth) && (
            <div className="py-4">
              <h2 className="text-sm text-gray-400 mb-3">
                Ruby Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {(product as any).rubyColor && (
                  <div className="py-1">
                    <span className="text-gray-500 text-xs">Ruby Color: </span>
                    <span className="text-gray-300 text-xs">{(product as any).rubyColor}</span>
                  </div>
                )}
                {(product as any).rubyClarity && (
                  <div className="py-1">
                    <span className="text-gray-500 text-xs">Ruby Clarity: </span>
                    <span className="text-gray-300 text-xs">{(product as any).rubyClarity}</span>
                  </div>
                )}
                {(product as any).rubyShape && (
                  <div className="py-1">
                    <span className="text-gray-500 text-xs">Ruby Shape: </span>
                    <span className="text-gray-300 text-xs">{(product as any).rubyShape}</span>
                  </div>
                )}
                {(product as any).rubyType && (
                  <div className="py-1">
                    <span className="text-gray-500 text-xs">Natural/Synthetic: </span>
                    <span className="text-gray-300 text-xs">{(product as any).rubyType}</span>
                  </div>
                )}
                {(product as any).rubySetting && (
                  <div className="py-1">
                    <span className="text-gray-500 text-xs">Ruby Setting: </span>
                    <span className="text-gray-300 text-xs">{(product as any).rubySetting}</span>
                  </div>
                )}
                {(product as any).rubyWeight && (
                  <div className="py-1">
                    <span className="text-gray-500 text-xs">Ruby Weight: </span>
                    <span className="text-gray-300 text-xs">{(product as any).rubyWeight}</span>
                  </div>
                )}
                {(product as any).rubyWidth && (
                  <div className="py-1">
                    <span className="text-gray-500 text-xs">Ruby Width: </span>
                    <span className="text-gray-300 text-xs">{(product as any).rubyWidth}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Warranty Information */}
          {(((product as any).warrantyCovered && (product as any).warrantyCovered.length > 0) || ((product as any).warrantyNotCovered && (product as any).warrantyNotCovered.length > 0)) && (
            <div className="py-4">
              <h2 className="text-sm text-gray-400 mb-3">
                Warranty Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(product as any).warrantyCovered && (product as any).warrantyCovered.length > 0 && (
                  <div>
                    <h3 className="text-xs text-gray-500 mb-2">Covered in Warranty:</h3>
                    <div className="space-y-1">
                      {(product as any).warrantyCovered.map((item: string, index: number) => (
                        <div key={index} className="text-xs text-gray-300">• {item}</div>
                      ))}
                    </div>
                  </div>
                )}
                {(product as any).warrantyNotCovered && (product as any).warrantyNotCovered.length > 0 && (
                  <div>
                    <h3 className="text-xs text-gray-500 mb-2">Not Covered in Warranty:</h3>
                    <div className="space-y-1">
                      {(product as any).warrantyNotCovered.map((item: string, index: number) => (
                        <div key={index} className="text-xs text-gray-300">• {item}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
            </div>
          )}
        </div>



        {/* Reviews Section */}
        <div className="mt-16">
          <ReviewsList productId={id} />
        </div>

        {/* Product Suggestions */}
        <div className="mt-16">
          <ProductSuggestions currentProduct={product} />
        </div>
      </div>
    </div>
  )
}
