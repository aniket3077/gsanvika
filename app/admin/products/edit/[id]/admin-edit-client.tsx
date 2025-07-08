"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft, Plus, Minus, Loader2, Info } from "lucide-react"
import { ProductService, type Product } from "@/lib/firebase/products"
import { ImageUpload } from "@/components/firebase/image-upload"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Helper component for field with tooltip
const FieldWithTooltip = ({ label, tooltip, children, required = false }: { 
  label: string; 
  tooltip?: string; 
  children: React.ReactNode; 
  required?: boolean;
}) => (
  <div>
    <div className="flex items-center space-x-2 mb-2">
      <Label className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {tooltip && (
        <Tooltip>
          <TooltipTrigger>
            <Info className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-sm">{tooltip}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
    {children}
  </div>
)

interface AdminEditClientProps {
  id: string
}

export default function AdminEditClient({ id }: AdminEditClientProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingProduct, setIsLoadingProduct] = useState(true)
  const [product, setProduct] = useState<Product | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [features, setFeatures] = useState<string[]>([""])
  const [specifications, setSpecifications] = useState<Array<{ key: string; value: string }>>([{ key: "", value: "" }])
  const [warrantyCovered, setWarrantyCovered] = useState<string[]>([""])
  const [warrantyNotCovered, setWarrantyNotCovered] = useState<string[]>([""])

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    mrp: "",
    stock: "",
    sku: "",
    weight: "",
    dimensions: "",
    material: "",
    care: "",
    status: "active" as "active" | "inactive",
    featured: false,
    
    // Product Information
    brand: "",
    chainIncluded: "",
    collection: "",
    netQuantity: "",
    packOf: "",
    
    // Product Details
    type: "",
    highlights: "",
    locketType: "",
    photoInsert: "",
    claspType: "",
    finish: "",
    otherFeatures: "",
    pendantWeight: "",
    
    // Chain Features
    chainMaterial: "",
    chainType: "",
    chainFinish: "",
    chainPlating: "",
    chainLength: "",
    chainWeight: "",
    chainHeight: "",
    chainThickness: "",
    
    // Earrings Details
    earringsIncluded: "",
    earringsDetail: "",
    
    // Ruby Features
    rubyColor: "",
    rubyClarity: "",
    rubyShape: "",
    rubyType: "",
    rubySetting: "",
    rubyWeight: "",
    rubyWidth: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load product data on mount
  useEffect(() => {
    const loadProduct = async () => {
      try {
        setIsLoadingProduct(true)
        const productData = await ProductService.getProduct(id)
        
        if (!productData) {
          router.push("/admin/products")
          return
        }

        setProduct(productData)
        setFormData({
          name: productData.name || "",
          description: productData.description || "",
          category: productData.category || "",
          price: productData.price?.toString() || "",
          mrp: productData.comparePrice?.toString() || "",
          stock: productData.stockQuantity?.toString() || "",
          sku: productData.sku || "",
          weight: productData.weight || "",
          dimensions: (productData as any).dimensionsText || (productData as any).dimensions || "",
          material: productData.material || "",
          care: Array.isArray(productData.careInstructions) 
            ? productData.careInstructions.join(", ") 
            : productData.careInstructions || "",
          status: (productData.stockQuantity > 0 && productData.inStock) ? "active" : "inactive",
          featured: productData.featured || false,
          
          // Product Information
          brand: (productData as any).brand || "",
          chainIncluded: (productData as any).chainIncluded || "",
          collection: (productData as any).collection || "",
          netQuantity: (productData as any).netQuantity || "",
          packOf: (productData as any).packOf || "",
          
          // Product Details
          type: (productData as any).type || "",
          highlights: (productData as any).highlights || "",
          locketType: (productData as any).locketType || "",
          photoInsert: (productData as any).photoInsert || "",
          claspType: (productData as any).claspType || "",
          finish: (productData as any).finish || "",
          otherFeatures: (productData as any).otherFeatures || "",
          pendantWeight: (productData as any).pendantWeight || "",
          
          // Chain Features
          chainMaterial: (productData as any).chainMaterial || "",
          chainType: (productData as any).chainType || "",
          chainFinish: (productData as any).chainFinish || "",
          chainPlating: (productData as any).chainPlating || "",
          chainLength: (productData as any).chainLength || "",
          chainWeight: (productData as any).chainWeight || "",
          chainHeight: (productData as any).chainHeight || "",
          chainThickness: (productData as any).chainThickness || "",
          
          // Earrings Details
          earringsIncluded: (productData as any).earringsIncluded || "",
          earringsDetail: (productData as any).earringsDetail || "",
          
          // Ruby Features
          rubyColor: (productData as any).rubyColor || "",
          rubyClarity: (productData as any).rubyClarity || "",
          rubyShape: (productData as any).rubyShape || "",
          rubyType: (productData as any).rubyType || "",
          rubySetting: (productData as any).rubySetting || "",
          rubyWeight: (productData as any).rubyWeight || "",
          rubyWidth: (productData as any).rubyWidth || "",
        })

        setImages(productData.images || [])
        setFeatures(productData.features && productData.features.length > 0 ? productData.features : [""])
        
        // Convert specifications object to array format
        const specsArray = productData.specifications 
          ? Object.entries(productData.specifications).map(([key, value]) => ({ key, value: String(value) }))
          : [{ key: "", value: "" }]
        setSpecifications(specsArray.length > 0 ? specsArray : [{ key: "", value: "" }])
        
        // Load warranty data
        setWarrantyCovered((productData as any).warrantyCovered || [""])
        setWarrantyNotCovered((productData as any).warrantyNotCovered || [""])

      } catch (error) {
        console.error("Error loading product:", error)
        alert("Failed to load product data")
        router.push("/admin/products")
      } finally {
        setIsLoadingProduct(false)
      }
    }

    if (id) {
      loadProduct()
    }
  }, [id, router])

  if (!user?.isAdmin) {
    router.push("/")
    return null
  }

  if (isLoadingProduct) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Product not found</p>
          <Button asChild className="mt-4">
            <Link href="/admin/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }))
    if (errors.category) {
      setErrors((prev) => ({ ...prev, category: "" }))
    }
  }

  const addFeature = () => {
    setFeatures((prev) => [...prev, ""])
  }

  const removeFeature = (index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index))
  }

  const updateFeature = (index: number, value: string) => {
    setFeatures((prev) => prev.map((feature, i) => (i === index ? value : feature)))
  }

  const addSpecification = () => {
    setSpecifications((prev) => [...prev, { key: "", value: "" }])
  }

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index))
  }

  const updateSpecification = (index: number, field: "key" | "value", value: string) => {
    setSpecifications((prev) => prev.map((spec, i) => (i === index ? { ...spec, [field]: value } : spec)))
  }

  const addWarrantyCovered = () => {
    setWarrantyCovered((prev) => [...prev, ""])
  }

  const removeWarrantyCovered = (index: number) => {
    setWarrantyCovered((prev) => prev.filter((_, i) => i !== index))
  }

  const updateWarrantyCovered = (index: number, value: string) => {
    setWarrantyCovered((prev) => prev.map((item, i) => (i === index ? value : item)))
  }

  const addWarrantyNotCovered = () => {
    setWarrantyNotCovered((prev) => [...prev, ""])
  }

  const removeWarrantyNotCovered = (index: number) => {
    setWarrantyNotCovered((prev) => prev.filter((_, i) => i !== index))
  }

  const updateWarrantyNotCovered = (index: number, value: string) => {
    setWarrantyNotCovered((prev) => prev.map((item, i) => (i === index ? value : item)))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Required fields
    if (!formData.name.trim()) newErrors.name = "Product name is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.price || Number.parseFloat(formData.price) <= 0) newErrors.price = "Valid selling price is required"
    if (!formData.mrp || Number.parseFloat(formData.mrp) <= 0) newErrors.mrp = "Valid MRP is required"
    if (!formData.stock || Number.parseInt(formData.stock) < 0) newErrors.stock = "Valid stock quantity is required"

    // Price validation
    if (formData.price && formData.mrp && Number.parseFloat(formData.price) > Number.parseFloat(formData.mrp)) {
      newErrors.price = "Selling price cannot be higher than MRP"
    }

    // Images validation
    if (images.length === 0) {
      newErrors.images = "At least one product image is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      alert("Please fix the errors in the form before submitting.")
      return
    }

    setIsLoading(true)

    try {
      // Prepare product data
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: Number(formData.price),
        comparePrice: Number(formData.mrp),
        stockQuantity: Number(formData.stock),
        inStock: formData.status === "active" && Number(formData.stock) > 0,
        imageUrl: images[0] || '',
        images,
        features: features.filter((f) => f.trim() !== ""),
        specifications: specifications.reduce(
          (acc, spec) => {
            if (spec.key.trim() && spec.value.trim()) {
              return { ...acc, [spec.key.trim()]: spec.value.trim() }
            }
            return acc
          },
          {} as Record<string, string>
        ),
        featured: formData.featured,
        
        // Additional product fields
        weight: formData.weight || undefined,
        material: formData.material || undefined,
        careInstructions: formData.care ? [formData.care] : undefined,
        sku: formData.sku || undefined,
        
        // Store additional custom fields
        ...(formData.dimensions && { dimensionsText: formData.dimensions }),
        
        // Product Information
        ...(formData.brand && { brand: formData.brand }),
        ...(formData.chainIncluded && { chainIncluded: formData.chainIncluded }),
        ...(formData.collection && { collection: formData.collection }),
        ...(formData.netQuantity && { netQuantity: formData.netQuantity }),
        ...(formData.packOf && { packOf: formData.packOf }),
        
        // Product Details
        ...(formData.type && { type: formData.type }),
        ...(formData.highlights && { highlights: formData.highlights }),
        ...(formData.locketType && { locketType: formData.locketType }),
        ...(formData.photoInsert && { photoInsert: formData.photoInsert }),
        ...(formData.claspType && { claspType: formData.claspType }),
        ...(formData.finish && { finish: formData.finish }),
        ...(formData.otherFeatures && { otherFeatures: formData.otherFeatures }),
        ...(formData.pendantWeight && { pendantWeight: formData.pendantWeight }),
        
        // Chain Features
        ...(formData.chainMaterial && { chainMaterial: formData.chainMaterial }),
        ...(formData.chainType && { chainType: formData.chainType }),
        ...(formData.chainFinish && { chainFinish: formData.chainFinish }),
        ...(formData.chainPlating && { chainPlating: formData.chainPlating }),
        ...(formData.chainLength && { chainLength: formData.chainLength }),
        ...(formData.chainWeight && { chainWeight: formData.chainWeight }),
        ...(formData.chainHeight && { chainHeight: formData.chainHeight }),
        ...(formData.chainThickness && { chainThickness: formData.chainThickness }),
        
        // Earrings Details
        ...(formData.earringsIncluded && { earringsIncluded: formData.earringsIncluded }),
        ...(formData.earringsDetail && { earringsDetail: formData.earringsDetail }),
        
        // Ruby Features
        ...(formData.rubyColor && { rubyColor: formData.rubyColor }),
        ...(formData.rubyClarity && { rubyClarity: formData.rubyClarity }),
        ...(formData.rubyShape && { rubyShape: formData.rubyShape }),
        ...(formData.rubyType && { rubyType: formData.rubyType }),
        ...(formData.rubySetting && { rubySetting: formData.rubySetting }),
        ...(formData.rubyWeight && { rubyWeight: formData.rubyWeight }),
        ...(formData.rubyWidth && { rubyWidth: formData.rubyWidth }),
        
        // Warranty Information
        ...(warrantyCovered.filter(item => item.trim() !== "").length > 0 && { warrantyCovered: warrantyCovered.filter(item => item.trim() !== "") }),
        ...(warrantyNotCovered.filter(item => item.trim() !== "").length > 0 && { warrantyNotCovered: warrantyNotCovered.filter(item => item.trim() !== "") }),
      } as any

      await ProductService.updateProduct(id, productData)
      
      alert(`Product "${productData.name}" has been updated successfully!`)
      router.push("/admin/products")
    } catch (error) {
      console.error("Error updating product:", error)
      alert("An error occurred while updating the product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card border-b border-gold-200/20">
          <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center h-auto gap-2 py-2">
              <div className="flex items-center space-x-4">
                <Link href="/admin/products" className="text-gold-500 hover:text-gold-600">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="font-serif text-2xl font-bold text-foreground">Edit Product</h1>
              </div>
            </div>
          </div>
        </div>

        <main className="w-full max-w-4xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-8">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Basic Information */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Basic Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <FieldWithTooltip label="Product Name" tooltip="Enter the name of the product as you want it to appear on the website." required>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter product name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </FieldWithTooltip>
                </div>

                <div className="md:col-span-2">
                  <FieldWithTooltip label="Description" tooltip="Provide a detailed description of the product, including features, benefits, and any other relevant information." required>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your product..."
                      rows={4}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                  </FieldWithTooltip>
                </div>

                <div>
                  <FieldWithTooltip label="Category" tooltip="Select the category that best fits your product. This helps in organizing products and improving searchability." required>
                    <Select value={formData.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jewelry">Jewelry</SelectItem>
                        <SelectItem value="photo-frames">Photo Frames</SelectItem>
                        <SelectItem value="resin-art">Resin Art</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </FieldWithTooltip>
                </div>

                <div>
                  <FieldWithTooltip label="SKU" tooltip="Stock Keeping Unit - a unique identifier for each product, used for inventory management.">
                    <Input
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      placeholder="Product SKU"
                    />
                  </FieldWithTooltip>
                </div>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Pricing & Inventory</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <FieldWithTooltip label="MRP (Maximum Retail Price)" tooltip="The maximum retail price at which the product can be sold. This is the price before any discounts." required>
                    <Input
                      id="mrp"
                      name="mrp"
                      type="number"
                      value={formData.mrp}
                      onChange={handleInputChange}
                      placeholder="0"
                      className={errors.mrp ? "border-red-500" : ""}
                    />
                    {errors.mrp && <p className="text-red-500 text-sm mt-1">{errors.mrp}</p>}
                  </FieldWithTooltip>
                </div>

                <div>
                  <FieldWithTooltip label="Selling Price" tooltip="The price at which the product is being sold. This should be lower than the MRP." required>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="0"
                      className={errors.price ? "border-red-500" : ""}
                    />
                    {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                  </FieldWithTooltip>
                </div>

                <div>
                  <FieldWithTooltip label="Stock Quantity" tooltip="The number of items available in stock for this product." required>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      placeholder="0"
                      className={errors.stock ? "border-red-500" : ""}
                    />
                    {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                  </FieldWithTooltip>
                </div>
              </div>
            </div>

            {/* Visibility Settings */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Visibility Settings</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="status">Product Status</Label>
                  <Select value={formData.status} onValueChange={(value: string) => setFormData(prev => ({ ...prev, status: value as "active" | "inactive" }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active (In Stock)</SelectItem>
                      <SelectItem value="inactive">Inactive (Out of Stock)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: !!checked }))}
                  />
                  <Label htmlFor="featured" className="text-sm font-medium">
                    Featured Product
                    <span className="block text-xs text-muted-foreground">
                      Show this product on the homepage featured section
                    </span>
                  </Label>
                </div>
              </div>
            </div>

            {/* Product Images */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Product Images</h2>
              <ImageUpload
                onImagesChange={setImages}
                initialImages={images}
                maxImages={5}
                folder="products"
              />
              {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
            </div>

            {/* Basic Product Details */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Basic Product Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <FieldWithTooltip label="Weight" tooltip="Enter the weight of the product. This is important for shipping calculations.">
                    <Input
                      id="weight"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="e.g., 15 grams"
                    />
                  </FieldWithTooltip>
                </div>

                <div>
                  <FieldWithTooltip label="Dimensions" tooltip="Enter the dimensions of the product. This helps customers understand the size of the product.">
                    <Input
                      id="dimensions"
                      name="dimensions"
                      value={formData.dimensions}
                      onChange={handleInputChange}
                      placeholder="e.g., 2 x 1.5 inches"
                    />
                  </FieldWithTooltip>
                </div>

                <div>
                  <FieldWithTooltip label="Material" tooltip="Specify the material used in the product. This is crucial for product quality perception.">
                    <Input
                      id="material"
                      name="material"
                      value={formData.material}
                      onChange={handleInputChange}
                      placeholder="e.g., Sterling Silver, Diamonds"
                    />
                  </FieldWithTooltip>
                </div>

                <div>
                  <FieldWithTooltip label="Care Instructions" tooltip="Provide care instructions to help customers maintain the product.">
                    <Input
                      id="care"
                      name="care"
                      value={formData.care}
                      onChange={handleInputChange}
                      placeholder="e.g., Store in jewelry box"
                    />
                  </FieldWithTooltip>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Key Features</h2>

              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1"
                    />
                    {features.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeFeature(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addFeature}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
            </div>

            {/* Specifications */}
            <div className="bg-card rounded-lg p-6">
              <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Specifications</h2>

              <div className="space-y-3">
                {specifications.map((spec, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={spec.key}
                      onChange={(e) => updateSpecification(index, "key", e.target.value)}
                      placeholder="Specification name"
                      className="flex-1"
                    />
                    <Input
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, "value", e.target.value)}
                      placeholder="Specification value"
                      className="flex-1"
                    />
                    {specifications.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeSpecification(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSpecification}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Specification
                </Button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/admin/products")}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Product
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </TooltipProvider>
  )
}
