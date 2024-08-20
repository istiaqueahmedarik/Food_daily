import React from 'react'
import { ScrollArea } from './ui/scroll-area'

function DeliveryStatus() {
    const orderStatus = 'In Transit' // This could be 'Preparing', 'In Transit', or 'Delivered'

  return (
        <div div className = "w-80 border-r flex flex-col" >
              <div className="p-4 border-b">
                  <h2 className="text-lg font-semibold">Order #12345</h2>
                  <p className="text-sm text-muted-foreground">Estimated delivery: 15:00</p>
              </div>
              <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                      <div>
                          <h3 className="font-medium">Items:</h3>
                          <ul className="list-disc list-inside text-sm">
                              <li>1x Margherita Pizza</li>
                              <li>2x Garlic Bread</li>
                              <li>1x Coke (500ml)</li>
                          </ul>
                      </div>
                      <div>
                          <h3 className="font-medium">Total:</h3>
                          <p className="text-sm">$24.99</p>
                      </div>
                      <div>
                          <h3 className="font-medium">Delivery Address:</h3>
                          <p className="text-sm">123 Main St, Anytown, AN 12345</p>
                      </div>
                      <div>
                          <h3 className="font-medium">Status:</h3>
                          <div className="flex items-center space-x-2 mt-2">
                              <div className={`w-3 h-3 rounded-full ${orderStatus === 'Preparing' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                              <div className={`w-3 h-3 rounded-full ${orderStatus === 'In Transit' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                              <div className={`w-3 h-3 rounded-full ${orderStatus === 'Delivered' ? 'bg-green-500' : 'bg-gray-300'}`} />
                          </div>
                          <div className="flex justify-between text-xs mt-1">
                              <span>Preparing</span>
                              <span>In Transit</span>
                              <span>Delivered</span>
                          </div>
                      </div>
                  </div>
              </ScrollArea>
          </div>
  )
}

export default DeliveryStatus