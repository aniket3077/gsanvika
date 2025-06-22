"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package } from "lucide-react"
import ProductCard from "@/components/product/product-card"
import SearchBar from "@/components/common/search-bar"

interface Product {
  id: string
  name: string
  price: number
  images?: string[]
  category: string
  imageUrl: string
}

interface CategoryWithProducts {
  key: string
  name: string
  description: string
  href: string
  products: Product[]
  totalCount: number
}

interface CollectionsContentProps {
  categories: CategoryWithProducts[]
}

export default function CollectionsContent({ categories }: CollectionsContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCategories, setFilteredCategories] = useState(categories)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    
    if (!query.trim()) {
      setFilteredCategories(categories)
      return
    }

    const filtered = categories.map(category => ({
      ...category,
      products: category.products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      )
    })).filter(category => 
      category.products.length > 0 || 
      category.name.toLowerCase().includes(query.toLowerCase())
    )

    setFilteredCategories(filtered)
  }

  // Get total products count
  const totalProducts = categories.reduce((sum, category) => sum + category.totalCount, 0)

  return (
    <main className="pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            All Collections
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover our complete range of handcrafted pieces across all categories. From timeless jewelry to contemporary art, find the perfect addition to your collection.
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{categories.length}</div>
              <div className="text-sm text-muted-foreground">Categories</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-foreground">{totalProducts}</div>
              <div className="text-sm text-muted-foreground">Products</div>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} placeholder="Search across all collections..." />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-16">
          {filteredCategories.map((category) => (
            <section key={category.key} className="space-y-8">
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
                    {category.name}
                  </h2>
                  <p className="text-muted-foreground max-w-2xl">
                    {category.description}
                  </p>
                </div>
                <Link href={category.href}>
                  <Button variant="outline" className="group">
                    View All ({category.totalCount})
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>

              {/* Products Grid */}
              {category.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {category.products.map((product) => {
                    // Transform product to match ProductCard interface
                    const displayProduct = {
                      id: product.id,
                      name: product.name,
                      price: product.price,
                      image: product.images?.[0] || product.imageUrl || '/placeholder.svg',
                      category: product.category
                    }
                    return (
                      <ProductCard key={product.id} product={displayProduct} />
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-muted rounded-lg">
                  <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No Products Found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery 
                      ? `No products match "${searchQuery}" in this category.`
                      : "Products coming soon to this category."
                    }
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* No results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-16">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No Collections Found</h2>
            <p className="text-muted-foreground mb-6">
              No collections match your search for "{searchQuery}". Try a different search term.
            </p>
            <Button onClick={() => handleSearch("")} variant="outline">
              Show All Collections
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-20 bg-muted/30 rounded-lg p-8 sm:p-12 text-center">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            We're constantly adding new pieces to our collection. Contact us for custom orders or to inquire about specific items.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/search">
              <Button variant="outline">
                Advanced Search
              </Button>
            </Link>
            <Link href="/profile">
              <Button className="bg-gold-500 hover:bg-gold-600 text-black">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
