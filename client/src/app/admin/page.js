import { get_with_token } from '@/action'
import OrderSummary from '@/components/AdminSection/OrderSummary';
import Revenue from '@/components/AdminSection/Revenue';

import React, { Suspense } from 'react'

export const experimental_ppr = true;

async function page() {
    const [qa] = await Promise.all([get_with_token('jwt/getQAofficers')])
    if (qa.error !== undefined) 
        redirect('/profile')
  return (
      <div>
          <div className="min-h-screen bg-background p-8">
              <div className="grid grid-cols-12 gap-6">
                  <Suspense fallback={<div>Loading...</div>}>
                      <OrderSummary />
                  </Suspense>
                  <Suspense fallback={<div>Loading...</div>}>
                  <Revenue />
                    </Suspense>


              </div>
          </div>

      </div>
  )
}

export default page