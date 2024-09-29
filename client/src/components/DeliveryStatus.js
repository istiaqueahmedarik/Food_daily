import React from 'react'
import { ScrollArea } from './ui/scroll-area'
import { post_with_token } from '@/action'

async function DeliveryStatus({oid}) {
    
    const result = await post_with_token('jwt/orderDetails', { oid });
    const data = result.result[0];
    
    return (
     
        <div div className = "w-80 border-r flex flex-col" >
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Order {data['ORDER_ID']}</h2>
                <p className="text-sm text-muted-foreground">Name - {data['SHIPPING_NAME']}</p>
                <p className="text-sm text-muted-foreground">Phone - {data['SHIPPING_PHONE']}</p>
              </div>
              <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                      <div>
                          <h3 className="font-medium">Items:</h3>
                        {data['FOOD_NAMES'].split(',').map((item, index) => {
                            return (
                                <div key={index} className="flex justify-between">
                                    <span>{item}</span>
                                </div>
                            )
                          })}
                      </div>
                      <div>
                          <h3 className="font-medium">Total:</h3>
                        <p className="text-sm">৳{data['TOTAL']}</p>
                      </div>
                      <div>
                          <h3 className="font-medium">Delivery Address:</h3>
                        <p className="text-sm">{data['SHIPPING_ADD']}</p>
                      </div>
                      <div>
                          <h3 className="font-medium">Status:</h3>
                        <div className="flex justify-between text-xs mt-1">
                            <div className={`w-3 h-3 rounded-full ${data['ORDER_STATUS'] === 'PREPEARED' ? 'bg-blue-500' : 'bg-gray-300'}`} />
                            <div className={`w-3 h-3 rounded-full ${data['ORDER_STATUS'] === 'SHIPPED' ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                            <div className={`w-3 h-3 rounded-full ${data['ORDER_STATUS'] === 'DELIVERED' ? 'bg-green-500' : 'bg-gray-300'}`} />
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