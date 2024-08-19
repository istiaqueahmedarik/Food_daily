import React from 'react'

function LoadingSection() {
  return (

      <div className="flex bg-background text-white p-4 rounded-lg">
          {/* Left side - Image placeholder */}
          <div className="w-1/2 aspect-square bg-input rounded-lg animate-pulse" />

          {/* Right side - Content */}
          <div className="w-1/2 pl-4 space-y-4">
              {/* Title and rating */}
              <div className="space-y-2">
                  <div className="h-6 bg-input rounded w-3/4 animate-pulse" />
                  <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-4 h-4 bg-input rounded-full animate-pulse" />
                      ))}
                  </div>
              </div>

              {/* Subtitle */}
              <div className="h-4 bg-input rounded w-1/2 animate-pulse" />

              {/* Table skeleton */}
              <div className="space-y-2">
                  <div className="flex justify-between">
                      <div className="h-4 bg-input rounded w-1/4 animate-pulse" />
                      <div className="h-4 bg-input rounded w-1/4 animate-pulse" />
                      <div className="h-4 bg-input rounded w-1/4 animate-pulse" />
                  </div>
                  <div className="flex justify-between">
                      <div className="h-4 bg-input rounded w-1/4 animate-pulse" />
                      <div className="h-4 bg-input rounded w-1/4 animate-pulse" />
                      <div className="h-4 bg-input rounded w-1/4 animate-pulse" />
                  </div>
              </div>

              {/* Price */}
              <div className="h-8 bg-input rounded w-1/3 animate-pulse" />

              {/* Input field */}
              <div className="h-10 bg-input rounded animate-pulse" />

              {/* Button */}
              <div className="h-12 bg-input rounded animate-pulse" />
          </div>
      </div>

  )
}

export default LoadingSection