import { get_with_token, post_with_token } from '@/action';
import React from 'react'
import { buttonVariants } from './ui/button3';

async function DeliverySummary() {
    const [data, summary] = await Promise.all([post_with_token('jwt/getDelivery'), get_with_token('jwt/deliverySummary')]);
    const delivery = data.result[0];
    const totalOrder = summary.totalOrder[0]['TOTAL_ORDER'];
   
    const cap = 1.5;

    const totalEarning = summary.totalEarning[0]['TOTAL_EARNING']*cap;

    const avgDeliveryTime = (summary.avgDeliveryTime[0]['AVG_DELIVERY_TIME']*24*60).toFixed(2);
  return (
      <div
          className="rounded-lg border bg-card text-card-foreground shadow-sm col-span-1 md:col-span-2 lg:col-span-3"

      >
          <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Today's Deliveries</h3>
          </div>
          <div className='w-32 m-auto'>
              <a target="_blank" href={delivery['LICENSE']} className={buttonVariants({ variant: "secondary" })}>
                  Your License
              </a>
          </div>
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col items-center justify-center gap-2">
                  <div className="text-4xl font-bold">{totalOrder}</div>
                  <div className="text-muted-foreground">Total Orders</div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                  <div className="text-4xl font-bold">৳{totalEarning}</div>
                  <div className="text-muted-foreground">Total Earnings</div>
              </div>
              <div className="flex flex-col items-center justify-center gap-2">
                  <div className="text-4xl font-bold">{avgDeliveryTime} min</div>
                  <div className="text-muted-foreground">Avg. Delivery Time</div>
              </div>
          </div>
      </div>
  )
}

export default DeliverySummary