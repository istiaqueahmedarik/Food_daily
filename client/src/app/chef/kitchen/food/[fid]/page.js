import { get } from '@/action'
import Food from '@/components/Food'
import { FoodReportCta } from '@/components/food-report-cta'
import LoadingSection from '@/components/LoadingSection'
import Rating from '@/components/Rating'
import RatingCard from '@/components/RatingCard'
import React, { Suspense } from 'react'

export const experimental_ppr = true
async function page({params}) {

    
  return (
    <div>
      <Suspense fallback={<div><LoadingSection/></div>}>
        <Food params={params} />

      </Suspense>

      <Suspense fallback={<div>loading...</div>}>
        <RatingCard fid={params.fid} />

      </Suspense>
    </div>
  )
}

export default page