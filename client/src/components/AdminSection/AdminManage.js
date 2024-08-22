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
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
    ScatterChart,
    Scatter,
    ZAxis,
} from 'recharts'
import { ChefHat, Utensils, ShoppingBag, Truck, Users, DollarSign, Search, Bell, Settings, Activity, MoreHorizontal, AlertTriangle } from 'lucide-react'

export default function AdminManage() {
    const [chefs, setChefs] = useState([
        { id: 1, name: "Gordon Ramsay", speciality: "French Cuisine", rating: 4.9, orders: 1234 },
        { id: 2, name: "Jamie Oliver", speciality: "Italian Cuisine", rating: 4.7, orders: 987 },
        { id: 3, name: "Nigella Lawson", speciality: "British Cuisine", rating: 4.8, orders: 876 },
        { id: 4, name: "Nigella Lawson", speciality: "British Cuisine", rating: 4.8, orders: 876 },
    ])

    const [foodItems, setFoodItems] = useState([
        { id: 1, name: "Beef Wellington", chef: "Gordon Ramsay", price: 45, rating: 4.8 },
        { id: 2, name: "Pasta Carbonara", chef: "Jamie Oliver", price: 22, rating: 4.6 },
        { id: 3, name: "Sticky Toffee Pudding", chef: "Nigella Lawson", price: 15, rating: 4.7 },
    ])

    const [userReports, setUserReports] = useState([
        { id: 1, user: "John Doe", issue: "Late delivery", status: "Pending" },
        { id: 2, user: "Jane Smith", issue: "Incorrect order", status: "Resolved" },
        { id: 3, user: "Bob Johnson", issue: "Food quality", status: "Under Investigation" },
        { id: 4, user: "Bob Johnson", issue: "Food quality", status: "Under Investigation" },
        { id: 5, user: "Bob Johnson", issue: "Food quality", status: "Under Investigation" },

    ])

    const deleteChef = (id) => {
        setChefs(chefs.filter(chef => chef.id !== id))
    }

    const deleteFood = (id) => {
        setFoodItems(foodItems.filter(item => item.id !== id))
    }

    const updateReportStatus = (id, newStatus) => {
        setUserReports(userReports.map(report =>
            report.id === id ? { ...report, status: newStatus } : report
        ))
    }
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

    // ... (previous mock data and chart components remain the same)

    return (
        <div className="min-h-screen bg-background p-8">
            {/* Header and Summary Cards remain the same */}

            {/* Dashboard Grid */}
            <div className="grid grid-cols-12 gap-6">
                {/* ... (previous sections remain the same) */}
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
                {/* Manage Chefs */}
                <Card className="col-span-6">
                    <CardHeader>
                        <CardTitle>Manage Chefs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Speciality</TableHead>
                                    <TableHead>Rating</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {chefs.map((chef) => (
                                    <TableRow key={chef.id}>
                                        <TableCell>{chef.name}</TableCell>
                                        <TableCell>{chef.speciality}</TableCell>
                                        <TableCell>{chef.rating}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button3 variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button3>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button3 variant="ghost" className="p-0 hover:bg-transparent">Delete</Button3>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                                    <DialogDescription>
                                                                        This action cannot be undone. This will permanently delete the chef's account and remove their data from our servers.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <Button3 variant="outline">Cancel</Button3>
                                                                    <Button3 variant="destructive" onClick={() => deleteChef(chef.id)}>Delete</Button3>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Manage Food Items */}
                <Card className="col-span-6">
                    <CardHeader>
                        <CardTitle>Manage Food Items</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Chef</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {foodItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.chef}</TableCell>
                                        <TableCell>${item.price}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button3 variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button3>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem className="text-red-600">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button3 variant="ghost" className="p-0 hover:bg-transparent">Delete</Button3>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Are you sure?</DialogTitle>
                                                                    <DialogDescription>
                                                                        This action cannot be undone. This will permanently delete this food item from the menu.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <DialogFooter>
                                                                    <Button3 variant="outline">Cancel</Button3>
                                                                    <Button3 variant="destructive" onClick={() => deleteFood(item.id)}>Delete</Button3>
                                                                </DialogFooter>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* User Reports */}
                <Card className="col-span-12">
                    <CardHeader>
                        <CardTitle>User Reports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Issue</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {userReports.map((report) => (
                                    <TableRow key={report.id}>
                                        <TableCell>{report.user}</TableCell>
                                        <TableCell>{report.issue}</TableCell>
                                        <TableCell>{report.status}</TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button3 variant="ghost" className="h-8 w-8 p-0">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button3>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => updateReportStatus(report.id, "Under Investigation")}>
                                                        Mark as Under Investigation
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => updateReportStatus(report.id, "Resolved")}>
                                                        Mark as Resolved
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem>Contact User</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* ... (other sections remain the same) */}
            </div>
        </div>
    )
}