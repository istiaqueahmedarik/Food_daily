import React from 'react'

function LoadingCard() {
  return (
      <div className="w-64 bg-card rounded-lg p-4 animate-pulse">
          <div className="w-full h-40 bg-input rounded-lg mb-4"></div>
          <div className="h-6 bg-input rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-input rounded w-1/2 mb-4"></div>
          <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-input rounded-full"></div>
                  <div className="h-4 bg-input rounded w-20"></div>
              </div>
              <div className="h-4 bg-input rounded w-16"></div>
          </div>
          <div className="flex justify-between mt-4">
              <div className="h-6 bg-input rounded w-16"></div>
              <div className="h-6 bg-input rounded w-8"></div>
          </div>
      </div>
  )
}

export default LoadingCard