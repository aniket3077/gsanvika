import { Product } from '@/types/product'
import { ProductService } from '@/lib/firebase/products'
import { collection, getDocs, query, where, limit, orderBy, or, and } from 'firebase/firestore'
import { getFirestore } from '@/lib/firebase'

export interface SuggestionOptions {
  limit?: number
  priceRange?: { min: number; max: number }
  categories?: string[]
  excludeIds?: string[]
}

export class SuggestionsService {
  /**
   * Get related products based on category and similar features
   */
  static async getRelatedProducts(
    currentProduct: Product,
    options: SuggestionOptions = {}
  ): Promise<Product[]> {
    const { limit: limitCount = 8, excludeIds = [] } = options
    
    try {
      const db = await getFirestore()
      const productsRef = collection(db, 'products')
        // Query for products in the same category
      const q = query(
        productsRef,
        where('category', '==', currentProduct.category),
        where('inStock', '==', true),
        limit(limitCount + excludeIds.length + 1) // Get extra to account for excluded items
      )
      
      const querySnapshot = await getDocs(q)
      const products = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }) as Product)
        .filter(product => 
          product.id !== currentProduct.id && 
          !excludeIds.includes(product.id)
        )
        .slice(0, limitCount)
      
      return products
    } catch (error) {
      console.error('Error fetching related products:', error)
      return []
    }
  }

  /**
   * Get products in similar price range across categories
   */
  static async getSimilarPriceProducts(
    currentProduct: Product,
    options: SuggestionOptions = {}
  ): Promise<Product[]> {
    const { limit: limitCount = 6, excludeIds = [] } = options
    
    try {
      const db = await getFirestore()
      const productsRef = collection(db, 'products')
      
      // Define price range (±30% of current product price)
      const priceMin = currentProduct.price * 0.7
      const priceMax = currentProduct.price * 1.3
      
      const q = query(
        productsRef,
        where('price', '>=', priceMin),
        where('price', '<=', priceMax),
        where('inStock', '==', true),
        orderBy('price', 'asc'),
        limit(limitCount + excludeIds.length + 1)
      )
      
      const querySnapshot = await getDocs(q)
      const products = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }) as Product)
        .filter(product => 
          product.id !== currentProduct.id && 
          !excludeIds.includes(product.id)
        )
        .slice(0, limitCount)
      
      return products
    } catch (error) {
      console.error('Error fetching similar price products:', error)
      return []
    }
  }

  /**
   * Get trending/popular products
   */
  static async getTrendingProducts(
    currentProduct: Product,
    options: SuggestionOptions = {}
  ): Promise<Product[]> {
    const { limit: limitCount = 6, excludeIds = [] } = options
    
    try {
      const db = await getFirestore()
      const productsRef = collection(db, 'products')
        const q = query(
        productsRef,
        where('inStock', '==', true),
        limit(limitCount + excludeIds.length + 1)
      )
      
      const querySnapshot = await getDocs(q)
      const products = querySnapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }) as Product)
        .filter(product => 
          product.id !== currentProduct.id && 
          !excludeIds.includes(product.id)
        )
        .slice(0, limitCount)
      
      return products
    } catch (error) {
      console.error('Error fetching trending products:', error)
      return []
    }
  }

  /**
   * Get featured products as recommendations
   */
  static async getFeaturedProducts(
    currentProduct: Product,
    options: SuggestionOptions = {}
  ): Promise<Product[]> {
    const { limit: limitCount = 4, excludeIds = [] } = options
    
    try {
      const featuredProducts = await ProductService.getFeaturedProducts(limitCount + excludeIds.length + 1)
      return featuredProducts
        .filter(product => 
          product.id !== currentProduct.id && 
          !excludeIds.includes(product.id)
        )
        .slice(0, limitCount)
    } catch (error) {
      console.error('Error fetching featured products:', error)
      return []
    }
  }

  /**
   * Get comprehensive product suggestions
   */
  static async getProductSuggestions(currentProduct: Product): Promise<{
    related: Product[]
    similarPrice: Product[]
    trending: Product[]
    featured: Product[]
  }> {
    try {
      const [related, similarPrice, trending, featured] = await Promise.all([
        this.getRelatedProducts(currentProduct, { limit: 8 }),
        this.getSimilarPriceProducts(currentProduct, { limit: 6 }),
        this.getTrendingProducts(currentProduct, { limit: 6 }),
        this.getFeaturedProducts(currentProduct, { limit: 4 })
      ])

      return {
        related,
        similarPrice,
        trending,
        featured
      }
    } catch (error) {
      console.error('Error fetching product suggestions:', error)
      return {
        related: [],
        similarPrice: [],
        trending: [],
        featured: []
      }
    }
  }

  /**
   * Get recently viewed products from localStorage
   */
  static getRecentlyViewedProducts(currentProductId: string, limit: number = 4): Product[] {
    if (typeof window === 'undefined') return []
    
    try {
      const recentlyViewed = localStorage.getItem('recentlyViewed')
      if (!recentlyViewed) return []
      
      const products: Product[] = JSON.parse(recentlyViewed)
      return products
        .filter(product => product.id !== currentProductId)
        .slice(0, limit)
    } catch (error) {
      console.error('Error getting recently viewed products:', error)
      return []
    }
  }

  /**
   * Add product to recently viewed list
   */
  static addToRecentlyViewed(product: Product): void {
    if (typeof window === 'undefined') return
    
    try {
      const existing = localStorage.getItem('recentlyViewed')
      let recentlyViewed: Product[] = existing ? JSON.parse(existing) : []
      
      // Remove if already exists
      recentlyViewed = recentlyViewed.filter(p => p.id !== product.id)
      
      // Add to beginning
      recentlyViewed.unshift(product)
      
      // Keep only last 10 items
      recentlyViewed = recentlyViewed.slice(0, 10)
      
      localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed))
    } catch (error) {
      console.error('Error adding to recently viewed:', error)
    }
  }
}
