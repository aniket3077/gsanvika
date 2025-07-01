export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Navigation */}
        <div className="flex items-center gap-3 mb-8 animate-pulse">
          <div className="h-5 w-5 bg-gradient-to-r from-gray-700 to-gray-800 rounded-md animate-pulse"></div>
          <div className="h-5 w-28 bg-gradient-to-r from-gray-700 to-gray-800 rounded-md animate-pulse"></div>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16 mb-24">
          {/* Left Column - Images (3/5) */}
          <div className="lg:col-span-3 space-y-6">
            {/* Main Product Image */}
            <div className="relative aspect-square bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 rounded-2xl overflow-hidden animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-pulse"></div>
              <div className="absolute top-4 right-4 h-8 w-8 bg-gray-700 rounded-full animate-pulse"></div>
              <div className="absolute bottom-4 left-4 h-6 w-16 bg-gray-700/50 rounded-md animate-pulse"></div>
            </div>
            
            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg animate-pulse border border-gray-700/30"
                ></div>
              ))}
            </div>

            {/* Image Actions */}
            <div className="flex gap-3">
              <div className="flex-1 h-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-600 animate-pulse"></div>
              <div className="h-12 w-12 bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl border border-gray-600 animate-pulse"></div>
            </div>
          </div>

          {/* Right Column - Product Details (2/5) */}
          <div className="lg:col-span-2 space-y-8">
            {/* Product Header Card */}
            <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div className="flex-1 space-y-4">
                  <div className="h-12 w-full bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse"></div>
                  <div className="h-8 w-4/5 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse"></div>
                  
                  {/* Badges */}
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-32 bg-gradient-to-r from-[#C4A484]/20 to-[#C4A484]/30 rounded-full animate-pulse"></div>
                    <div className="h-8 w-28 bg-gradient-to-r from-yellow-500/20 to-orange-500/30 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <div className="h-12 w-12 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-[#C4A484]/30 animate-pulse"></div>
              </div>

              {/* Rating */}
              <div className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="h-5 w-5 bg-gradient-to-br from-yellow-400/30 to-yellow-600/40 rounded-sm animate-pulse"
                      ></div>
                    ))}
                  </div>
                  <div className="h-6 w-8 bg-gradient-to-r from-yellow-400/30 to-yellow-500/40 rounded-md animate-pulse"></div>
                  <div className="h-5 w-24 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Pricing Card */}
            <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex items-baseline gap-4 flex-wrap">
                  <div className="h-16 w-56 bg-gradient-to-r from-[#C4A484]/30 to-[#C4A484]/20 rounded-lg animate-pulse"></div>
                  <div className="h-8 w-32 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                  <div className="h-8 w-24 bg-gradient-to-r from-green-600/30 to-green-500/40 rounded-full animate-pulse"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-44 bg-gradient-to-r from-green-400/30 to-green-500/40 rounded-md animate-pulse"></div>
                  <div className="h-4 w-20 bg-gradient-to-r from-gray-600 to-gray-500 rounded-md animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Stock & Quantity Card */}
            <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
              {/* Stock Status */}
              <div className="flex items-center gap-3 mb-6 p-4 bg-gray-800/40 rounded-xl border border-gray-700/30">
                <div className="h-3 w-3 bg-gradient-to-r from-green-500 to-green-400 rounded-full animate-pulse"></div>
                <div className="h-5 w-24 bg-gradient-to-r from-green-500/30 to-green-400/40 rounded-md animate-pulse"></div>
                <div className="h-5 w-32 bg-gradient-to-r from-orange-500/30 to-orange-400/40 rounded-md animate-pulse"></div>
              </div>

              {/* Quantity Selector */}
              <div className="space-y-4">
                <div className="h-6 w-32 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 animate-pulse"></div>
                  <div className="h-12 w-20 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border-2 border-gray-600 animate-pulse"></div>
                  <div className="h-12 w-12 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl border border-gray-600 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Action Buttons Card */}
            <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 h-14 bg-gradient-to-r from-[#C4A484] to-[#B39479] rounded-xl animate-pulse"></div>
                  <div className="h-14 w-14 bg-gradient-to-br from-gray-800 to-gray-700 border-2 border-[#C4A484]/30 rounded-xl animate-pulse"></div>
                </div>
                <div className="h-4 w-80 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse mx-auto"></div>
              </div>
            </div>


          </div>
        </div>



        {/* Detailed Product Information Skeletons */}
        <div className="space-y-8 mb-16">
          {/* Basic Product Information Skeleton */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-6 bg-gradient-to-br from-[#C4A484] to-[#B39479] rounded-lg animate-pulse"></div>
              <div className="h-8 w-48 bg-gradient-to-r from-[#C4A484]/40 to-[#C4A484]/30 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gradient-to-r from-gray-600 to-gray-500 rounded-md animate-pulse"></div>
                  <div className="h-6 w-32 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-6 bg-gradient-to-br from-[#C4A484] to-[#B39479] rounded-lg animate-pulse"></div>
              <div className="h-8 w-40 bg-gradient-to-r from-[#C4A484]/40 to-[#C4A484]/30 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-28 bg-gradient-to-r from-gray-600 to-gray-500 rounded-md animate-pulse"></div>
                  <div className="h-6 w-36 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-gray-700/50">
              <div className="h-6 w-44 bg-gradient-to-r from-[#C4A484]/40 to-[#C4A484]/30 rounded-lg animate-pulse mb-3"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                <div className="h-4 w-4/5 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                <div className="h-4 w-3/5 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Chain Features Skeleton */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-6 bg-gradient-to-br from-[#C4A484] to-[#B39479] rounded-lg animate-pulse"></div>
              <div className="h-8 w-36 bg-gradient-to-r from-[#C4A484]/40 to-[#C4A484]/30 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-26 bg-gradient-to-r from-gray-600 to-gray-500 rounded-md animate-pulse"></div>
                  <div className="h-6 w-28 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Earrings Details Skeleton */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-6 bg-gradient-to-br from-[#C4A484] to-[#B39479] rounded-lg animate-pulse"></div>
              <div className="h-8 w-38 bg-gradient-to-r from-[#C4A484]/40 to-[#C4A484]/30 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-32 bg-gradient-to-r from-gray-600 to-gray-500 rounded-md animate-pulse"></div>
                  <div className="h-6 w-40 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Ruby Features Skeleton */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-6 bg-gradient-to-br from-[#C4A484] to-[#B39479] rounded-lg animate-pulse"></div>
              <div className="h-8 w-34 bg-gradient-to-r from-[#C4A484]/40 to-[#C4A484]/30 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-30 bg-gradient-to-r from-gray-600 to-gray-500 rounded-md animate-pulse"></div>
                  <div className="h-6 w-24 bg-gradient-to-r from-gray-700 to-gray-600 rounded-lg animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Warranty Information Skeleton */}
          <div className="bg-gradient-to-br from-gray-900/80 via-gray-800/50 to-gray-900/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-6 w-6 bg-gradient-to-br from-[#C4A484] to-[#B39479] rounded-lg animate-pulse"></div>
              <div className="h-8 w-52 bg-gradient-to-r from-[#C4A484]/40 to-[#C4A484]/30 rounded-lg animate-pulse"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="h-6 w-36 bg-gradient-to-r from-green-400/30 to-green-500/40 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-4 w-4 bg-green-400/30 rounded-sm mt-1 animate-pulse"></div>
                      <div className="h-4 w-48 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 w-40 bg-gradient-to-r from-red-400/30 to-red-500/40 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="h-4 w-4 bg-red-400/30 rounded-full mt-1 animate-pulse"></div>
                      <div className="h-4 w-44 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="mt-24">
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-to-br from-[#C4A484] to-[#B39479] rounded-lg animate-pulse"></div>
              <div className="h-8 w-48 bg-gradient-to-r from-[#C4A484]/40 to-[#C4A484]/30 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Rating Summary */}
            <div className="bg-gradient-to-br from-gray-900/70 via-gray-900/50 to-gray-800/30 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Overall Rating */}
                <div className="space-y-6 text-center">
                  <div className="h-16 w-32 bg-gradient-to-r from-[#C4A484]/30 to-[#C4A484]/20 rounded-xl animate-pulse mx-auto"></div>
                  <div className="flex items-center justify-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-6 w-6 bg-gradient-to-br from-yellow-400/40 to-yellow-600/50 rounded-sm animate-pulse"></div>
                    ))}
                  </div>
                  <div className="h-5 w-32 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse mx-auto"></div>
                </div>
                
                {/* Rating Distribution */}
                <div className="md:col-span-2 space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="h-5 w-12 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                      <div className="flex-1 h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r from-[#C4A484] to-[#B39479] rounded-full animate-pulse ${
                          i === 0 ? 'w-full' : i === 1 ? 'w-4/5' : i === 2 ? 'w-3/5' : i === 3 ? 'w-2/5' : 'w-1/5'
                        }`}></div>
                      </div>
                      <div className="h-5 w-10 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Individual Reviews */}
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-900/50 via-gray-800/30 to-gray-700/20 rounded-2xl p-6 border border-gray-700/40">
                  <div className="flex items-start gap-6">
                    {/* User Avatar */}
                    <div className="h-12 w-12 bg-gradient-to-br from-gray-700 to-gray-600 rounded-full animate-pulse flex-shrink-0"></div>
                    
                    {/* Review Content */}
                    <div className="flex-1 space-y-4">
                      {/* User Info & Rating */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-6 w-28 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, j) => (
                              <div key={j} className="h-4 w-4 bg-gradient-to-br from-yellow-400/40 to-yellow-600/50 rounded-sm animate-pulse"></div>
                            ))}
                          </div>
                        </div>
                        <div className="h-5 w-20 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                      </div>
                      
                      {/* Review Text */}
                      <div className="space-y-3">
                        <div className="h-5 w-full bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                        <div className="h-5 w-4/5 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                        <div className="h-5 w-3/5 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                      </div>
                      
                      {/* Review Actions */}
                      <div className="flex items-center gap-4 pt-2">
                        <div className="h-8 w-20 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse"></div>
                        <div className="h-8 w-16 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Suggestions */}
        <div className="mt-24">
          <div className="space-y-8">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 bg-gradient-to-br from-[#C4A484] to-[#B39479] rounded-lg animate-pulse"></div>
                <div className="h-8 w-56 bg-gradient-to-r from-[#C4A484]/40 to-[#C4A484]/30 rounded-lg animate-pulse"></div>
              </div>
              <div className="h-10 w-24 bg-gradient-to-r from-gray-800 to-gray-700 rounded-lg animate-pulse"></div>
            </div>
            
            {/* Suggestion Categories */}
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 w-36 bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-xl animate-pulse shrink-0"></div>
              ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gradient-to-br from-gray-900/60 via-gray-800/40 to-gray-700/20 rounded-2xl p-6 border border-gray-700/40 hover:border-gray-600/60 transition-all duration-300 group">
                  <div className="space-y-6">
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl overflow-hidden animate-pulse">
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent group-hover:via-white/10 transition-all duration-300"></div>
                      <div className="absolute top-3 right-3 h-6 w-6 bg-gray-700 rounded-full animate-pulse"></div>
                    </div>
                    
                    {/* Product Info */}
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="h-6 w-full bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                        <div className="h-5 w-3/4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-md animate-pulse"></div>
                      </div>
                      
                      {/* Price & Rating */}
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="h-6 w-20 bg-gradient-to-r from-[#C4A484]/30 to-[#C4A484]/20 rounded-md animate-pulse"></div>
                          <div className="h-4 w-16 bg-gradient-to-r from-gray-700 to-gray-600 rounded-md animate-pulse"></div>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, j) => (
                            <div key={j} className="h-3 w-3 bg-gradient-to-br from-yellow-400/30 to-yellow-600/40 rounded-sm animate-pulse"></div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="h-10 w-full bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 rounded-lg animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}