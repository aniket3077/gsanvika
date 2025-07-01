import { notFound } from "next/navigation"
import { Suspense } from "react"
import Navbar from "@/components/common/navbar"
import Footer from "@/components/common/footer"
import ProductClientNew from "./product-client-new"
import { ProductService } from "@/lib/firebase/products"
import { preloadFirebase } from "@/lib/firebase"
import { Metadata } from 'next'

// Generate static params for static export
export async function generateStaticParams() {
  // Return empty array for static export - pages will be generated on demand
  return []
}

// Preload Firebase modules
preloadFirebase()

// Generate metadata for the page
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {  
  try {
    const { id } = await params
    const product = await ProductService.getProduct(id)
    return {
      title: product ? `${product.name} | Your Store` : 'Product Not Found',
      description: product?.description || 'Product details page',
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Product | Your Store',
      description: 'Product details page',
    }
  }
}

// The main page component with full screen layout
export default async function ProductPageNew({ params }: { params: Promise<{ id: string }> }) {
  // Pre-fetch the product data on the server
  const { id } = await params
  const product = await ProductService.getProduct(id)
  
  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Fixed Navigation */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
        <Navbar />
      </div>
      
      {/* Main Content - Takes full remaining height */}
      <main className="flex-1 relative">
        <Suspense fallback={
          <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C4A484] mx-auto"></div>
              <p className="text-muted-foreground">Loading product details...</p>
            </div>
          </div>
        }>
          <ProductClientNew id={id} initialData={product} />
        </Suspense>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}