'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Tooltip } from '../ui/tooltip'

function AdminOverview() {
    const orderData = [
        { name: 'Pending', value: 15 },
        { name: 'Preparing', value: 10 },
        { name: 'Shipped', value: 5 },
        { name: 'Delivered', value: 70 },
    ]
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
    const userGrowthData = [
        { name: 'Jan', users: 1000 },
        { name: 'Feb', users: 1500 },
        { name: 'Mar', users: 2000 },
        { name: 'Apr', users: 2500 },
        { name: 'May', users: 3000 },
        { name: 'Jun', users: 3500 },
    ]
    const revenueData = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 5000 },
        { name: 'Apr', revenue: 4500 },
        { name: 'May', revenue: 6000 },
        { name: 'Jun', revenue: 5500 },
    ]
  return (
      <div className="min-h-screen bg-background p-8">
          <div className="grid grid-cols-12 gap-6">
              
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

              {/* User Growth Chart */}
              <Card className="col-span-8">
                  <CardHeader>
                      <CardTitle>User Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={userGrowthData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Legend />
                              <Line type="monotone" dataKey="users" stroke="#8884d8" />
                          </LineChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>
              <Card className="col-span-12">
                  <CardHeader>
                      <CardTitle>Revenue Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={revenueData}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Legend />
                              <Bar dataKey="revenue" fill="#8884d8" />
                          </BarChart>
                      </ResponsiveContainer>
                  </CardContent>
              </Card>
          </div>
      </div>
  )
}

export default AdminOverview