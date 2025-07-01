"use client"
// Component memoized for performance (15.66KB)
// Force dynamic rendering for admin pages that require authentication
export const dynamic = 'force-dynamic'

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, ArrowLeft, Plus, Minus, Info } from "lucide-react"
import { ProductService } from "@/lib/firebase/products"
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

export default function NewProductPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
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
    
    // Warranty Information
    warrantyCovered: [] as string[],
    warrantyNotCovered: [] as string[],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  if (!user?.isAdmin) {
    router.push("/")
    return null
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
        inStock: Number(formData.stock) > 0,
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
        averageRating: 0,
        totalReviews: 0,
        
        // Additional product fields
        weight: formData.weight || undefined,
        material: formData.material || undefined,
        careInstructions: formData.care ? [formData.care] : undefined,
        sku: formData.sku || undefined,
        
        // Store additional custom fields as specifications
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

      // Save product
      const productId = await ProductService.createProduct(productData)

      // Show success message
      alert(`Product "${productData.name}" has been added successfully!`)

      // Redirect to products list
      router.push("/admin/products")
    } catch (error) {
      console.error("Error adding product:", error)
      alert("An error occurred while adding the product. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-gold-200/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/products" className="text-gold-500 hover:text-gold-600">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="font-serif text-2xl font-bold text-foreground">Add New Product</h1>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Basic Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <FieldWithTooltip label="Product Name" tooltip="Enter the name of the product as you want it to appear on the website.">
                  <Label htmlFor="name">Product Name *</Label>
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
                <FieldWithTooltip label="Description" tooltip="Provide a detailed description of the product, including features, benefits, and any other relevant information.">
                  <Label htmlFor="description">Description *</Label>
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
                <FieldWithTooltip label="Category" tooltip="Select the category that best fits your product. This helps in organizing products and improving searchability.">
                  <Label htmlFor="category">Category *</Label>
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
                  <Label htmlFor="sku">SKU</Label>
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
                <FieldWithTooltip label="MRP (Maximum Retail Price)" tooltip="The maximum retail price at which the product can be sold. This is the price before any discounts.">
                  <Label htmlFor="mrp">MRP (₹) *</Label>
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
                <FieldWithTooltip label="Selling Price" tooltip="The price at which the product is being sold. This should be lower than the MRP.">
                  <Label htmlFor="price">Selling Price (₹) *</Label>
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
                <FieldWithTooltip label="Stock Quantity" tooltip="The number of items available in stock for this product.">
                  <Label htmlFor="stock">Stock Quantity *</Label>
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

          {/* Basic Product Details */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Basic Product Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FieldWithTooltip label="Weight" tooltip="Enter the weight of the product. This is important for shipping calculations.">
                  <Label htmlFor="weight">Weight</Label>
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
                  <Label htmlFor="dimensions">Dimensions</Label>
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
                  <Label htmlFor="material">Material</Label>
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
                  <Label htmlFor="care">Care Instructions</Label>
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

          {/* Product Information */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Product Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FieldWithTooltip label="Brand" tooltip="Enter the brand name of the product. This helps in brand-based filtering and search.">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    placeholder="e.g., Saanvika"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Chain Included" tooltip="Specify if a chain is included with the product. This is important for jewelry items.">
                  <Label htmlFor="chainIncluded">Chain Included</Label>
                  <Select value={formData.chainIncluded} onValueChange={(value) => setFormData(prev => ({ ...prev, chainIncluded: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Collection" tooltip="Enter the collection name if the product belongs to a specific collection.">
                  <Label htmlFor="collection">Collection</Label>
                  <Input
                    id="collection"
                    name="collection"
                    value={formData.collection}
                    onChange={handleInputChange}
                    placeholder="e.g., Premium Collection"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Net Quantity" tooltip="Specify the net quantity of the product in the package.">
                  <Label htmlFor="netQuantity">Net Quantity</Label>
                  <Input
                    id="netQuantity"
                    name="netQuantity"
                    value={formData.netQuantity}
                    onChange={handleInputChange}
                    placeholder="e.g., 1 Piece"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Pack of" tooltip="Indicate the number of items in a pack.">
                  <Label htmlFor="packOf">Pack of</Label>
                  <Input
                    id="packOf"
                    name="packOf"
                    value={formData.packOf}
                    onChange={handleInputChange}
                    placeholder="e.g., 1"
                  />
                </FieldWithTooltip>
              </div>
            </div>
          </div>

          {/* Detailed Product Information */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Detailed Product Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FieldWithTooltip label="Type" tooltip="Specify the type of the product, e.g., Necklace, Bracelet, etc.">
                  <Label htmlFor="type">Type</Label>
                  <Input
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    placeholder="e.g., Necklace Set"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Highlights" tooltip="Enter key highlights or features of the product.">
                  <Label htmlFor="highlights">Highlights</Label>
                  <Input
                    id="highlights"
                    name="highlights"
                    value={formData.highlights}
                    onChange={handleInputChange}
                    placeholder="e.g., Elegant Design, Premium Quality"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Locket Type" tooltip="Specify the type of locket, if applicable.">
                  <Label htmlFor="locketType">Locket Type</Label>
                  <Input
                    id="locketType"
                    name="locketType"
                    value={formData.locketType}
                    onChange={handleInputChange}
                    placeholder="e.g., Traditional"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Locket with Photo Insert" tooltip="Indicate if the locket has a photo insert feature.">
                  <Label htmlFor="photoInsert">Locket with Photo Insert</Label>
                  <Select value={formData.photoInsert} onValueChange={(value) => setFormData(prev => ({ ...prev, photoInsert: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Clasp Type" tooltip="Specify the type of clasp used in the jewelry.">
                  <Label htmlFor="claspType">Clasp Type</Label>
                  <Input
                    id="claspType"
                    name="claspType"
                    value={formData.claspType}
                    onChange={handleInputChange}
                    placeholder="e.g., Hook Clasp"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Finish" tooltip="Enter the finish type of the product, e.g., Gold Plated, Silver Plated, etc.">
                  <Label htmlFor="finish">Finish</Label>
                  <Input
                    id="finish"
                    name="finish"
                    value={formData.finish}
                    onChange={handleInputChange}
                    placeholder="e.g., Gold Plated"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Other Features" tooltip="Mention any other notable features of the product.">
                  <Label htmlFor="otherFeatures">Other Features</Label>
                  <Input
                    id="otherFeatures"
                    name="otherFeatures"
                    value={formData.otherFeatures}
                    onChange={handleInputChange}
                    placeholder="e.g., Hypoallergenic, Tarnish Resistant"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Pendant Weight" tooltip="Enter the weight of the pendant, if applicable.">
                  <Label htmlFor="pendantWeight">Pendant Weight</Label>
                  <Input
                    id="pendantWeight"
                    name="pendantWeight"
                    value={formData.pendantWeight}
                    onChange={handleInputChange}
                    placeholder="e.g., 15g"
                  />
                </FieldWithTooltip>
              </div>
            </div>
          </div>

          {/* Chain Features */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Chain Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FieldWithTooltip label="Chain Material" tooltip="Specify the material of the chain.">
                  <Label htmlFor="chainMaterial">Chain Material</Label>
                  <Input
                    id="chainMaterial"
                    name="chainMaterial"
                    value={formData.chainMaterial}
                    onChange={handleInputChange}
                    placeholder="e.g., Brass"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Chain Type" tooltip="Enter the type of chain, e.g., Cable Chain, Snake Chain, etc.">
                  <Label htmlFor="chainType">Chain Type</Label>
                  <Input
                    id="chainType"
                    name="chainType"
                    value={formData.chainType}
                    onChange={handleInputChange}
                    placeholder="e.g., Cable Chain"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Chain Finish" tooltip="Specify the finish of the chain.">
                  <Label htmlFor="chainFinish">Chain Finish</Label>
                  <Input
                    id="chainFinish"
                    name="chainFinish"
                    value={formData.chainFinish}
                    onChange={handleInputChange}
                    placeholder="e.g., Gold Plated"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Chain Plating" tooltip="Enter the plating details of the chain, if any.">
                  <Label htmlFor="chainPlating">Chain Plating</Label>
                  <Input
                    id="chainPlating"
                    name="chainPlating"
                    value={formData.chainPlating}
                    onChange={handleInputChange}
                    placeholder="e.g., 18K Gold"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Chain Length" tooltip="Specify the length of the chain.">
                  <Label htmlFor="chainLength">Chain Length</Label>
                  <Input
                    id="chainLength"
                    name="chainLength"
                    value={formData.chainLength}
                    onChange={handleInputChange}
                    placeholder="e.g., 18 inches"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Chain Weight" tooltip="Enter the weight of the chain.">
                  <Label htmlFor="chainWeight">Chain Weight</Label>
                  <Input
                    id="chainWeight"
                    name="chainWeight"
                    value={formData.chainWeight}
                    onChange={handleInputChange}
                    placeholder="e.g., 25g"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Chain Height" tooltip="Specify the height of the chain links, if applicable.">
                  <Label htmlFor="chainHeight">Chain Height</Label>
                  <Input
                    id="chainHeight"
                    name="chainHeight"
                    value={formData.chainHeight}
                    onChange={handleInputChange}
                    placeholder="e.g., 2mm"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Chain Thickness" tooltip="Enter the thickness of the chain.">
                  <Label htmlFor="chainThickness">Chain Thickness</Label>
                  <Input
                    id="chainThickness"
                    name="chainThickness"
                    value={formData.chainThickness}
                    onChange={handleInputChange}
                    placeholder="e.g., 1.5mm"
                  />
                </FieldWithTooltip>
              </div>
            </div>
          </div>

          {/* Earrings Details */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Earrings Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FieldWithTooltip label="Earrings Included" tooltip="Specify if earrings are included with the product.">
                  <Label htmlFor="earringsIncluded">Earrings Included</Label>
                  <Select value={formData.earringsIncluded} onValueChange={(value) => setFormData(prev => ({ ...prev, earringsIncluded: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Earrings Detail" tooltip="Provide details about the earrings, if included.">
                  <Label htmlFor="earringsDetail">Earrings Detail</Label>
                  <Input
                    id="earringsDetail"
                    name="earringsDetail"
                    value={formData.earringsDetail}
                    onChange={handleInputChange}
                    placeholder="e.g., Matching Drop Earrings"
                  />
                </FieldWithTooltip>
              </div>
            </div>
          </div>

          {/* Ruby Features */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Ruby Features</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <FieldWithTooltip label="Ruby Color" tooltip="Specify the color of the ruby.">
                  <Label htmlFor="rubyColor">Ruby Color</Label>
                  <Input
                    id="rubyColor"
                    name="rubyColor"
                    value={formData.rubyColor}
                    onChange={handleInputChange}
                    placeholder="e.g., Deep Red"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Ruby Clarity" tooltip="Enter the clarity grade of the ruby.">
                  <Label htmlFor="rubyClarity">Ruby Clarity</Label>
                  <Input
                    id="rubyClarity"
                    name="rubyClarity"
                    value={formData.rubyClarity}
                    onChange={handleInputChange}
                    placeholder="e.g., VS1"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Ruby Shape" tooltip="Specify the shape of the ruby, e.g., Round, Oval, etc.">
                  <Label htmlFor="rubyShape">Ruby Shape</Label>
                  <Input
                    id="rubyShape"
                    name="rubyShape"
                    value={formData.rubyShape}
                    onChange={handleInputChange}
                    placeholder="e.g., Oval"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Natural/Synthetic Ruby" tooltip="Indicate whether the ruby is natural or synthetic.">
                  <Label htmlFor="rubyType">Natural/Synthetic Ruby</Label>
                  <Select value={formData.rubyType} onValueChange={(value) => setFormData(prev => ({ ...prev, rubyType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Natural">Natural</SelectItem>
                      <SelectItem value="Synthetic">Synthetic</SelectItem>
                    </SelectContent>
                  </Select>
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Ruby Setting" tooltip="Specify the setting type of the ruby, e.g., Prong, Bezel, etc.">
                  <Label htmlFor="rubySetting">Ruby Setting</Label>
                  <Input
                    id="rubySetting"
                    name="rubySetting"
                    value={formData.rubySetting}
                    onChange={handleInputChange}
                    placeholder="e.g., Prong Setting"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Ruby Weight" tooltip="Enter the weight of the ruby.">
                  <Label htmlFor="rubyWeight">Ruby Weight</Label>
                  <Input
                    id="rubyWeight"
                    name="rubyWeight"
                    value={formData.rubyWeight}
                    onChange={handleInputChange}
                    placeholder="e.g., 2.5 Carats"
                  />
                </FieldWithTooltip>
              </div>

              <div>
                <FieldWithTooltip label="Ruby Width" tooltip="Specify the width of the ruby.">
                  <Label htmlFor="rubyWidth">Ruby Width</Label>
                  <Input
                    id="rubyWidth"
                    name="rubyWidth"
                    value={formData.rubyWidth}
                    onChange={handleInputChange}
                    placeholder="e.g., 8mm"
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
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder="Enter a key feature"
                    className="flex-1"
                  />
                  {features.length > 1 && (
                    <Button type="button" variant="outline" size="sm" onClick={() => removeFeature(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addFeature} className="mt-2">
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
                <div key={index} className="flex items-center space-x-2">
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
                    <Button type="button" variant="outline" size="sm" onClick={() => removeSpecification(index)}>
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addSpecification} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Specification
              </Button>
            </div>
          </div>

          {/* Warranty Information */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Warranty Information</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Covered in Warranty */}
              <div>
                <h3 className="text-lg font-semibold text-green-600 mb-4">Covered in Warranty</h3>
                <div className="space-y-3">
                  {warrantyCovered.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={item}
                        onChange={(e) => updateWarrantyCovered(index, e.target.value)}
                        placeholder="Enter warranty coverage item"
                        className="flex-1"
                      />
                      {warrantyCovered.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeWarrantyCovered(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addWarrantyCovered} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Coverage Item
                  </Button>
                </div>
              </div>

              {/* Not Covered in Warranty */}
              <div>
                <h3 className="text-lg font-semibold text-red-600 mb-4">Not Covered in Warranty</h3>
                <div className="space-y-3">
                  {warrantyNotCovered.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={item}
                        onChange={(e) => updateWarrantyNotCovered(index, e.target.value)}
                        placeholder="Enter warranty exclusion item"
                        className="flex-1"
                      />
                      {warrantyNotCovered.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeWarrantyNotCovered(index)}>
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button type="button" variant="outline" size="sm" onClick={addWarrantyNotCovered} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Exclusion Item
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-card rounded-lg p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-6">Product Images *</h2>

            <ImageUpload initialImages={images} onImagesChange={setImages} maxImages={8} />

            {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <Link href="/admin/products">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" className="bg-gold-500 hover:bg-gold-600 text-black" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Product
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

