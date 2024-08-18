import { get } from '@/action'
import Food from '@/components/Food'
import Rating from '@/components/Rating'
import React, { Suspense } from 'react'

export const experimental_ppr = true
async function page({params}) {

  const res = await get(`getFood/${params.fid}`)

    
  return (
    <div>
      <Food res={res} params={params} />
      <Rating />
    </div>
  )
}

export default page