import DeliveryChat from '@/components/DeliveryChat'
import DeliveryStatus from '@/components/DeliveryStatus'
import LoadingCard from '@/components/ui/LoadingCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { Suspense } from 'react'

function page() {
   

  return (
    <>
      <Suspense fallback={<LoadingCard />}>
        <DeliveryChat />
      </Suspense>
    </>
  )
}

export default page