import { post_with_token } from '@/action'
import DeliveryChat from '@/components/DeliveryChat'
import DeliveryStatus from '@/components/DeliveryStatus'
import LoadingCard from '@/components/ui/LoadingCard'
import { ScrollArea } from '@/components/ui/scroll-area'
import React, { Suspense } from 'react'

async function page({params}) {
  
  const { delivery, user,type } = await post_with_token('jwt/orderDetailsConnection', {oid:params.id})
  return (
    <>
      <Suspense fallback={<LoadingCard />}>
        <DeliveryChat delivery={delivery} user={user} type={type} />
      </Suspense>
    </>
  )
}

export default page