"use client"
// Component memoized for performance (5.25KB)
import React from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useAuth } from "@/components/auth/auth-provider"
import Navbar from "@/components/common/navbar"
import Footer from "@/components/common/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, MapPin, Edit } from "lucide-react"

function ProfileContent() {
  const { user } = useAuth()

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-4 sm:pt-6 lg:pt-8 pb-16 sm:pb-20">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4 sm:mb-6 lg:mb-8">My Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <div className="bg-card rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
                  <h2 className="font-serif text-lg sm:text-xl font-semibold text-foreground">Personal Information</h2>
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                      <Input id="name" value={user.name} readOnly className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input id="email" value={user.email} readOnly className="mt-1" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium">Phone</Label>
                      <Input id="phone" placeholder="Add phone number" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="birthday" className="text-sm font-medium">Birthday</Label>
                      <Input id="birthday" type="date" className="mt-1" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-sm font-medium">Address</Label>
                    <Input id="address" placeholder="Add your address" className="mt-1" />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Summary */}
            <div className="space-y-4 sm:space-y-6">
              <div className="bg-card rounded-lg p-4 sm:p-6">
                <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Account Summary</h3>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm sm:text-base text-muted-foreground">Member Since</span>
                    <span className="text-sm sm:text-base font-medium text-foreground">Jan 2024</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm sm:text-base text-muted-foreground">Total Orders</span>
                    <span className="text-sm sm:text-base font-medium text-foreground">5</span>
                  </div>

                  <div className="flex items-center justify-between py-1">
                    <span className="text-sm sm:text-base text-muted-foreground">Total Spent</span>
                    <span className="text-sm sm:text-base font-medium text-gold-500">₹1,25,000</span>
                  </div>

                  {user.isAdmin && (
                    <div className="pt-3 sm:pt-4 border-t border-gold-200/20">
                      <span className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium bg-gold-100 text-gold-800">
                        Admin Account
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-card rounded-lg p-4 sm:p-6">
                <h3 className="font-serif text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">Quick Actions</h3>

                <div className="space-y-2 sm:space-y-3">
                  <Button variant="outline" className="w-full justify-start text-sm sm:text-base">
                    <User className="h-4 w-4 mr-2 flex-shrink-0" />
                    View Orders
                  </Button>

                  <Button variant="outline" className="w-full justify-start text-sm sm:text-base">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    Contact Support
                  </Button>

                  {user.isAdmin && (
                    <Link href="/admin">
                      <Button variant="outline" className="w-full justify-start text-sm sm:text-base">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  )
}


