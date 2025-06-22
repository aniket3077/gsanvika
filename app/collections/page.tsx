import { Metadata } from "next"
import Navbar from "@/components/common/navbar"
import Footer from "@/components/common/footer"
import CollectionsContent from "@/components/collections/collections-content"
import { ProductService } from "@/lib/firebase/products"
import { Suspense } from "react"
import { preloadFirebase } from "@/lib/firebase"

// Enable revalidation to ensure fresh product data
export const revalidate = 60 // Revalidate every 60 seconds

// Preload Firebase modules
preloadFirebase()

export const metadata: Metadata = {
  title: "All Collections | Global Saanvika",
  description: "Explore all our collections - from exquisite handcrafted jewelry to contemporary resin art and elegant photo frames. Discover the perfect piece for your unique style.",
  keywords: "collections, jewelry, photo frames, resin art, handcrafted, artisan, Global Saanvika",
  openGraph: {
    title: "All Collections | Global Saanvika",
    description: "Explore all our collections - from exquisite handcrafted jewelry to contemporary resin art and elegant photo frames.",
    type: "website",
  },
}

// Categories configuration
const categories = [
  {
    key: "jewelry",
    name: "Jewelry Collection",
    description: "Exquisite handcrafted jewelry pieces, each designed to celebrate your unique style and elegance.",
    href: "/category/jewelry",
  },
  {
    key: "photo-frames",
    name: "Photo Frames",
    description: "Preserve your precious memories in our beautifully crafted photo frames, designed to complement any space.",
    href: "/category/photo-frames",
  },
  {
    key: "resin-art",
    name: "Resin Art",
    description: "Explore our contemporary resin art collection, where creativity meets craftsmanship in stunning visual displays.",
    href: "/category/resin-art",
  },
]

// Loading component
function CollectionsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="text-center space-y-4">
            <div className="h-12 w-80 bg-gray-200 rounded mx-auto"></div>
            <div className="h-6 w-96 bg-gray-200 rounded mx-auto"></div>
          </div>
          <div className="space-y-12">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-6">
                <div className="h-8 w-64 bg-gray-200 rounded"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, j) => (
                    <div key={j} className="space-y-4">
                      <div className="h-64 bg-gray-200 rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                      <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

// Collections list component
async function CollectionsList() {
  try {
    // Get products for each category
    const categoryPromises = categories.map(async (category) => {
      try {
        const products = await ProductService.getProductsByCategory(category.key)
        return {
          ...category,
          products: products.slice(0, 8), // Show max 8 products per category
          totalCount: products.length,
        }
      } catch (error) {
        console.error(`Error loading products for category ${category.key}:`, error)
        return {
          ...category,
          products: [],
          totalCount: 0,
        }
      }
    })

    const categoriesWithProducts = await Promise.all(categoryPromises)

    return <CollectionsContent categories={categoriesWithProducts} />
  } catch (error) {
    console.error("Error loading collections:", error)
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Unable to Load Collections</h2>
          <p className="text-muted-foreground">Please try again later.</p>
        </div>
      </div>
    )
  }
}

export default function CollectionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<CollectionsLoading />}>
        <CollectionsList />
      </Suspense>
      <Footer />
    </div>
  )
}
