import AddFood from '@/components/AddFood'
import Loading from '@/components/Loading'
import React, { Suspense } from 'react'

function page({params}) {
  return (
      <div>
          <Suspense fallback={<Loading />}>
              <AddFood id={params.id} />
          </Suspense>
    </div>
  )
}

export default page