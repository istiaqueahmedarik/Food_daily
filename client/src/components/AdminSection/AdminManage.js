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



    const deleteChef = (id) => {
        setChefs(chefs.filter(chef => chef.id !== id))
    }

    const deleteFood = (id) => {
        setFoodItems(foodItems.filter(item => item.id !== id))
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



    return (
        <div className="min-h-screen bg-background p-8">

            <div className="grid grid-cols-12 gap-6">
                
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
                

                {/* ... (other sections remain the same) */}
            </div>
        </div>
    )
}