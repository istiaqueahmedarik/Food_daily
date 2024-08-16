import { acceptOrder, get_with_token } from "@/action";
import { ScrollArea } from "./ui/scroll-area";
import Button from "./ui/Button";

async function PendingDelivery(url,style) {
   
    const orders = await get_with_token('jwt/getOrders')
    const data = orders.result;
    const pending = await get_with_token('jwt/activeOrders')
    const length = pending.result.length;
  return (
      <div className="p-6 border border-input rounded-xl">
          <h2 className="text-xl font-bold mb-4">Pending Offers</h2>
          <ScrollArea className="h-96">
              <ul className="space-y-4">
                  {data.map((order, index) => {
                      const oid = order['DELETED_ID'];
                      const binded = acceptOrder.bind(null, oid);
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
                              <form action={binded}>
                                  <Button disabled={length!==0}>
                                      Accept
                                  </Button>
                              </form>
                                  
                              </li>

                      )
                  })}

              </ul>
            </ScrollArea>
      </div>
  )
}

export default PendingDelivery