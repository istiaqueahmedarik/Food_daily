import { Button3 } from "@/components/ui/button3"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ChefHat, LogOut } from 'lucide-react'
import Button from "./ui/Button"
import { acceptFoodChef, post_with_token } from "@/action"


const initialOrders = [
    {
        id: '1',
        customerName: 'John Doe',
        items: ['Margherita Pizza', 'Caesar Salad'],
        timestamp: '2023-05-10T14:30:00Z'
    },
    {
        id: '2',
        customerName: 'Jane Smith',
        items: ['Spaghetti Carbonara', 'Garlic Bread'],
        specialInstructions: 'Extra cheese on the carbonara',
        timestamp: '2023-05-10T14:35:00Z'
    },
    {
        id: '3',
        customerName: 'Bob Johnson',
        items: ['Grilled Salmon', 'Mashed Potatoes', 'Steamed Vegetables'],
        timestamp: '2023-05-10T14:40:00Z'
    }
]

export default async function ChefsOrder({ kid }) {
    const data = await post_with_token('jwt/chefOrder',{kid:kid});

    const orders = data.result;

    

    return (
        <div className="flex flex-col bg-background m-5 border p-5 rounded-lg">
            <div>
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Your Orders</h1>
                    
                </div>
            </div>
                <ScrollArea className="h-92">
                    <div className="space-y-4">
                    {orders.map(order => {
                        const binded = acceptFoodChef.bind(null, {
                            kid: kid,
                            oid: order['ORDER_ID']
                        })
                        return (
                            <div key={order['ORDER_ID']} className="bg-card text-card-foreground p-4 rounded-lg shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h2 className="text-xl font-semibold">{order['SHIPPING_NAME']}</h2>
                                        <div className="flex flex-wrap">
                                            <p className="text-sm text-muted-foreground">
                                                Order #{order['ORDER_ID']} -
                                            </p>
                                            <Badge variant="secondary">{new Date(order['DATE_ADDED']).toLocaleString()}</Badge>
                                        </div>
                                    </div>
                                    <Badge variant="secondary">{order['ORDER_STATUS'] === 'PENDING' ? 'NEW_ORDER' : order['ORDER_STATUS']}</Badge>
                                </div>
                                <div className="mb-2">
                                    {order['FOOD_NAMES']}
                                </div>

                                <form action={binded} className={`${order['ORDER_STATUS'] !== 'PENDING' && 'hidden'} flex w-fit space-x-2`}>
                                    <Button txt="Complete" variant="default" />
                                </form>
                            </div>
                        )
                            
})}
                    </div>
                </ScrollArea>
        </div>
    )
}