'use client'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button3 } from "@/components/ui/button3"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
} from 'recharts'
import { ChefHat, Utensils, ShoppingBag, Truck, Users, DollarSign, Search, Bell, Settings } from 'lucide-react'

export default function AdminSummary() {
    // Mock data (replace with actual data from your backend)
    const orderData = [
        { name: 'Pending', value: 15 },
        { name: 'Preparing', value: 10 },
        { name: 'Shipped', value: 5 },
        { name: 'Delivered', value: 70 },
    ]

    const revenueData = [
        { name: 'Jan', revenue: 4000 },
        { name: 'Feb', revenue: 3000 },
        { name: 'Mar', revenue: 5000 },
        { name: 'Apr', revenue: 4500 },
        { name: 'May', revenue: 6000 },
        { name: 'Jun', revenue: 5500 },
    ]

    const userGrowthData = [
        { name: 'Jan', users: 1000 },
        { name: 'Feb', users: 1500 },
        { name: 'Mar', users: 2000 },
        { name: 'Apr', users: 2500 },
        { name: 'May', users: 3000 },
        { name: 'Jun', users: 3500 },
    ]

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center space-x-4">
                    <Input
                        type="text"
                        placeholder="Search..."
                        className="w-64"
                    />
                    <Button3 variant="outline" size="icon">
                        <Search className="h-4 w-4" />
                    </Button3>
                    <Button3 variant="outline" size="icon">
                        <Bell className="h-4 w-4" />
                    </Button3>
                    <Button3 variant="outline" size="icon">
                        <Settings className="h-4 w-4" />
                    </Button3>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* Summary Cards */}
                <Card className="col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Chefs</CardTitle>
                        <ChefHat className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">56</div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">789</div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,345</div>
                    </CardContent>
                </Card>

                {/* Charts */}
                <Card className="col-span-8">
                    <CardHeader>
                        <CardTitle>Revenue Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="revenue" fill="#8884d8" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
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
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* User Growth Chart */}
                <Card className="col-span-6">
                    <CardHeader>
                        <CardTitle>User Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Line type="monotone" dataKey="users" stroke="#8884d8" />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card className="col-span-6">
                    <CardHeader>
                        <CardTitle>Recent Orders</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Total</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>ORD-001</TableCell>
                                    <TableCell>John Doe</TableCell>
                                    <TableCell>$45.99</TableCell>
                                    <TableCell>Preparing</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>ORD-002</TableCell>
                                    <TableCell>Jane Smith</TableCell>
                                    <TableCell>$32.50</TableCell>
                                    <TableCell>Delivered</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>ORD-003</TableCell>
                                    <TableCell>Bob Johnson</TableCell>
                                    <TableCell>$78.25</TableCell>
                                    <TableCell>Shipped</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Top Chefs */}
                <Card className="col-span-6">
                    <CardHeader>
                        <CardTitle>Top Chefs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Speciality</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Orders</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Gordon Ramsay</TableCell>
                                    <TableCell>French Cuisine</TableCell>
                                    <TableCell>4.9</TableCell>
                                    <TableCell>1,234</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Jamie Oliver</TableCell>
                                    <TableCell>Italian Cuisine</TableCell>
                                    <TableCell>4.7</TableCell>
                                    <TableCell>987</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Nigella Lawson</TableCell>
                                    <TableCell>British Cuisine</TableCell>
                                    <TableCell>4.8</TableCell>
                                    <TableCell>876</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Popular Kitchens */}
                <Card className="col-span-6">
                    <CardHeader>
                        <CardTitle>Popular Kitchens</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Chef</TableHead>
                                    <TableHead>City</TableHead>
                                    <TableHead>Rating</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Tasty Bites</TableCell>
                                    <TableCell>Gordon Ramsay</TableCell>
                                    <TableCell>New York</TableCell>
                                    <TableCell>4.8</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Spice Paradise</TableCell>
                                    <TableCell>Jamie Oliver</TableCell>
                                    <TableCell>London</TableCell>
                                    <TableCell>4.7</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Gourmet Haven</TableCell>
                                    <TableCell>Nigella Lawson</TableCell>
                                    <TableCell>Paris</TableCell>
                                    <TableCell>4.9</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Active Deliveries */}
                <Card className="col-span-12">
                    <CardHeader>
                        <CardTitle>Active Deliveries</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Order ID</TableHead>
                                    <TableHead>Customer</TableHead>
                                    <TableHead>Delivery Partner</TableHead>
                                    <TableHead>Pickup Location</TableHead>
                                    <TableHead>Delivery Location</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell>ORD-004</TableCell>
                                    <TableCell>Alice Cooper</TableCell>
                                    <TableCell>John Smith</TableCell>
                                    <TableCell>Tasty Bites, New York</TableCell>
                                    <TableCell>123 Broadway, New York</TableCell>
                                    <TableCell>In Transit</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>ORD-005</TableCell>
                                    <TableCell>David Bowie</TableCell>
                                    <TableCell>Sarah Johnson</TableCell>
                                    <TableCell>Spice Paradise, London</TableCell>
                                    <TableCell>456 Oxford St, London</TableCell>
                                    <TableCell>Picked Up</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>ORD-006</TableCell>
                                    <TableCell>Freddie Mercury</TableCell>
                                    <TableCell>Michael Brown</TableCell>
                                    <TableCell>Gourmet Haven, Paris</TableCell>
                                    <TableCell>789 Champs-Élysées, Paris</TableCell>
                                    <TableCell>Assigned</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}