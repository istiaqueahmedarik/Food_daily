'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

function RevenueContent({ data }) {
    console.log(data)
   
    return (
    <Card className="col-span-8">
                  <CardHeader>
                      <CardTitle>Order Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={data}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="DAY" />
                              <YAxis />
                              <Legend />
                              <Line type="monotone" dataKey="COUNT" stroke="#8884d8" />
                          </LineChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>
              

  )
}

export default RevenueContent