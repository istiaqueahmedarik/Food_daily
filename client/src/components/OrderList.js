import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { Button3, buttonVariants } from './ui/button3'
import { Badge } from './ui/badge'
import { PersonalCancelOrder, post_with_token } from '@/action'
import Link from 'next/link'

async function OrderList() {
    const data = await post_with_token('jwt/orderHistory', {});
    const orders = data.result;
    
  return (
      <div>
          <Card className="w-full max-w-4xl mx-auto">
              <CardHeader>
                  <CardTitle>Your Orders</CardTitle>
                  <CardDescription>Your Current and Previous Order History</CardDescription>
              </CardHeader>
              <CardContent>
                  <ScrollArea className="h-[400px] w-full rounded-md  p-4">
                      {orders.map((order, index) => { 
                          const binded = PersonalCancelOrder.bind(null, order['ORDER_ID'])
                          return (
                              <Card key={index} className="mb-4">
                                  <CardHeader>
                                      <CardTitle className="text-lg flex items-center justify-between">
                                          Order ID: {order['ORDER_ID']}
                                          <Badge variant="info" className="mb-2">{new Date(order['DATE_ADDED']).toLocaleString()}</Badge>
                                      </CardTitle>
                                      
                                  </CardHeader>
                                  <CardContent>
                                      
                                      <h4 className="font-semibold mb-2">{order['FOOD_NAMES']}</h4>
                                      
                                      <p className="mt-2 font-semibold">Total: ৳{order['TOTAL']} </p>
                                  </CardContent>
                                  {(order['ORDER_STATUS'] === 'DELIVERED' || order['ORDER_STATUS'] === 'CANCELLED') ? <CardFooter>
                                      <Badge variant={order['ORDER_STATUS'] === 'DELIVERED' ? 'success' : 'danger'}>{order['ORDER_STATUS']}</Badge>
                                  </CardFooter> : 
                                      <form action={binded} className={` flex flex-wrap gap-6 m-5`}>
                                          <Button3 variant="" className="w-fit">Cancel</Button3>
                                          <Link className={`${buttonVariants({ variant: "outline" })} !w-fit ${order['ORDER_STATUS'] === 'SHIPPED' ? 'block':'hidden'}`} href={`/delivery_chat/${order['ORDER_ID']}`}>View Details</Link>
                                      </form>
                                    }
                                      
                              </Card>
                          )
                      })}
                  </ScrollArea>
              </CardContent>
          </Card>
    </div>
  )
}

export default OrderList