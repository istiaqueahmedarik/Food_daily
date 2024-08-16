import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { ScrollArea } from './ui/scroll-area'
import { Button3 } from './ui/button3'
import { Badge } from './ui/badge'

async function OrderList() {
  return (
      <div>
          <Card className="w-full max-w-4xl mx-auto">
              <CardHeader>
                  <CardTitle>Chef's Order Dashboard</CardTitle>
                  <CardDescription>Accept or reject incoming orders</CardDescription>
              </CardHeader>
              <CardContent>
                  <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                          <Card className="mb-4">
                              <CardHeader>
                                  <CardTitle className="text-lg flex items-center justify-between">
                                      Order #1
                                      <Badge  className="ml-2">
                                          <span className="ml-1 capitalize">a</span>
                                      </Badge>
                                  </CardTitle>
                                  <CardDescription>Customer: b</CardDescription>
                              </CardHeader>
                              <CardContent>
                                  <h4 className="font-semibold mb-2">Items:</h4>
                              <ul className="list-disc pl-5">
                                  <li>2</li>
                                   
                                  </ul>
                                  <p className="mt-2 font-semibold">Total: $2</p>
                              </CardContent>
                              <CardFooter className="flex justify-end space-x-2">
                              <Button3 variant="destructive">Reject</Button3>
                              <Button3>Accept</Button3>
                              </CardFooter>
                          </Card>
                  </ScrollArea>
              </CardContent>
          </Card>
    </div>
  )
}

export default OrderList