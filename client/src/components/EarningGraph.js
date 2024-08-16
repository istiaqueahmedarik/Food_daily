import React from 'react'
import OrderChart from './OrderChart'
import { get_with_token } from '@/action'

async function EarningGraph() {
  const data = await get_with_token('jwt/earningByDay/7');
  let earning = data.result;
  earning = earning.map((item) => {
    const modified_day = new Date(item.DAY).getDay();
    let weekday = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return {
      DAY: weekday[modified_day],
      TOTAL_EARNING: item.TOTAL_EARNING
    }
  })

  return (
    <div
      className="rounded-lg border bg-card text-card-foreground shadow-sm  col-span-3"

    >
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Earnings Graph</h3>
      </div>
      <div className="p-6">
        <OrderChart className="aspect-[30/9]" earning={earning} />

      </div>
    </div>
  )
}

export default EarningGraph