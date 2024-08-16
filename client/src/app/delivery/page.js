import { get_with_token, post_with_token } from '@/action'
import ActiveDelivery from '@/components/ActiveDelivery'
import DeliveryHistory from '@/components/DeliveryHistory'
import DeliverySummary from '@/components/DeliverySummary'
import EarningGraph from '@/components/EarningGraph'
import OrderChart from '@/components/OrderChart'
import PendingDelivery from '@/components/PendingDelivery'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button3'
import Link from 'next/link'
import React, { Suspense } from 'react'
export const experimental_ppr = true
async function page() {
   
    
    
  return (
      <div>
          <div className="flex flex-col min-h-screen bg-background">
              
              <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 sm:p-6">
                  <Suspense fallback={<div>Loading...</div>}>
                      <DeliverySummary />
                    </Suspense>
                  <Suspense fallback={<div>Loading...</div>}>
                      <EarningGraph />
                  </Suspense>
              </main>
          </div>

          <div className="flex flex-col h-screen">

              <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                  <section className="bg-background rounded-lg shadow-md">
                      <Suspense fallback={<div>Loading...</div>}>
                          <PendingDelivery />
                        </Suspense>
                  </section>
                  <div className='flex flex-col'>
                      <Suspense fallback={<div>Loading...</div>}>
                          <ActiveDelivery />
                        </Suspense>
                      <Suspense fallback={<div>Loading...</div>}>
                          <DeliveryHistory />
                        </Suspense>
                 </div>
              </main>
          </div>
     </div>
  )
}

export default page