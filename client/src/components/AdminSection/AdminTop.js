import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ChefHat, DollarSign, ShoppingBag, Users } from 'lucide-react';
import { get_with_token } from '@/action';

export async function AdminTop() {
    const data = await get_with_token('jwt/allSummary');
    
  return (
      <div className="grid grid-cols-12 gap-6 m-5">
          <Card className="col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{data.count_user}</div>
              </CardContent>
          </Card>
          <Card className="col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Chefs</CardTitle>
                  <ChefHat className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{data.count_chef}</div>
              </CardContent>
          </Card>
          <Card className="col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{data.total_order}</div>
              </CardContent>
          </Card>
          <Card className="col-span-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">৳{data.revenue}</div>
              </CardContent>
          </Card>
      </div>
  )
}

export default AdminTop