'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from 'recharts'
import { get_with_token } from '@/action';

function OrderSummaryContent({orderData}) {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
  

    return (
      <Card className="col-span-4">
          <CardHeader>
              <CardTitle>Order Status</CardTitle>
          </CardHeader>
         
      <CardContent>
          <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                  <Pie
                      data={orderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                  >
                      {orderData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                  </Pie>
                  <Legend />
              </PieChart>
          </ResponsiveContainer>
            </CardContent>
        </Card>

  )
}

export default OrderSummaryContent