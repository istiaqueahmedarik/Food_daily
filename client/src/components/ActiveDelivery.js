import { acceptOrder, cancelOrder, completeOrder, get_with_token } from "@/action";
import { ScrollArea } from "./ui/scroll-area";
import Button from "./ui/Button";

async function ActiveDelivery() {
   
    const orders = await get_with_token('jwt/activeOrders')
    const data = orders.result;
    
  return (
      <div className="p-6 border border-input rounded-xl">
          <h2 className="text-xl font-bold mb-4">Active Offers</h2>
          <div className="h-fit">
              <ul className="space-y-4">
                  {data.map((order, index) => {
                      const oid = order['DELETED_ID'];
                      const binded = completeOrder.bind(null, oid);
                      const binded2 = cancelOrder.bind(null, oid);
                      return (
                              <li key={index} className="bg-background border border-input rounded-lg p-4 flex justify-between items-center gap-3">
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
                              <div className="flex flex-col gap-4">
                                  <form action={binded}>
                                      <Button txt="Complete" />
                                          
                                  </form>

                                  <form action={binded2}>
                                      <Button variant={"outline"} txt="Reject" />
                                  </form>
                             </div>
                                  
                              </li>

                      )
                  })}

              </ul>
            </div>
      </div>
  )
}

export default ActiveDelivery