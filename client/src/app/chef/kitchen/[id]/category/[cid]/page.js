import { get } from '@/action'
import FoodCard from '@/components/FoodCard'
import React from 'react'

async function page({ params }) {
  
  const res = await get(`getFoods/${params.cid}`)
  return (
    <div>
      <FoodCard params={params}/>
    </div>
  )
}

export default page