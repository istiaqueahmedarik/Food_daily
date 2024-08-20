import { acceptOrder, cancelOrder, completeOrder, get_with_token } from "@/action";
import { ScrollArea } from "./ui/scroll-area";
import Button from "./ui/Button";
import { Badge } from "./ui/badge";
import { buttonVariants } from "./ui/button3";

async function DeliveryHistory() {

    const orders = await get_with_token('jwt/orderHistory')
    const data = orders.result;
    
    return (
        <div className="p-6 border border-input rounded-xl my-5">
            <h2 className="text-xl font-bold mb-4">Delivery History</h2>
            <ScrollArea className="h-96">
                <ul className="space-y-4">
                    {data.length === 0 && <p>No Orders</p>}
                    {data.map((order, index) => {
                        
                        return (
                            <li key={index} className="relative bg-background border border-input rounded-lg p-4 flex justify-between items-center gap-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <p className="font-medium">Kitchen Name:</p>
                                    <p>{order['NAME']}</p>
                                    <p className="font-medium ">Kitchen Location:</p>
                                    <p>{order['ADDRESS']}</p>
                                    <p className="font-medium ">Customer Name:</p>
                                    <p>{order['SHIPPING_NAME']}</p>
                                    <p className="font-medium ">Customer Contact Number:</p>
                                    <p>{order['SHIPPING_PHONE']}</p>

                                    <p className="font-medium ">Customer Location:</p>
                                    <p>{order['SHIPPING_ADD']}</p>
                                    <p className="font-medium ">Order Details:</p>
                                    <p>{order['FOOD_NAMES']}</p>
                                </div>
                                <div className="right-0 top-0 absolute m-2">
                                    <Badge variant={"secondary"}>Completed</Badge>
                               </div>

                            </li>

                        )
                    })}

                </ul>
            </ScrollArea>
        </div>
    )
}

export default DeliveryHistory