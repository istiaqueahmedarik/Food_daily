import React from 'react'

function LoadingSearch() {
  return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-background">
          {[1, 2].map((item) => (
              <div key={item} className="bg-card rounded-lg overflow-hidden shadow-lg">
                  <div className="animate-pulse">
                      {/* Image placeholder */}
                      <div className="bg-input h-48 w-full"></div>

                      <div className="p-4">
                          {/* Title placeholder */}
                          <div className="h-6 bg-input rounded w-3/4 mb-2"></div>

                          {/* Description placeholder */}
                          <div className="h-4 bg-input rounded w-1/2 mb-4"></div>

                          <div className="flex justify-between items-center">
                              {/* Chef info placeholder */}
                              <div className="flex items-center space-x-2">
                                  <div className="rounded-full bg-input h-8 w-8"></div>
                                  <div className="h-4 bg-input rounded w-20"></div>
                              </div>

                              {/* City placeholder */}
                              <div className="h-4 bg-input rounded w-16"></div>
                          </div>

                          <div className="flex justify-between items-center mt-4">
                              {/* Price placeholder */}
                              <div className="h-6 bg-input rounded w-16"></div>

                              {/* Rating placeholder */}
                              <div className="h-6 bg-input rounded w-8"></div>
                          </div>
                      </div>
                  </div>
              </div>
          ))}

          {/* Navigation arrow placeholder */}
          <div className="col-span-full flex justify-center mt-4">
              <div className="h-10 w-10 bg-input rounded-full"></div>
          </div>
      </div>
  )
}

export default LoadingSearch