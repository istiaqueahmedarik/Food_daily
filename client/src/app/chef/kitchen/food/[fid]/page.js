import { get } from '@/action'
import Food from '@/components/Food'
import React from 'react'

async function page({params}) {

  // const [res,ing] = await Promise.all([get(`getFood/${params.fid}`),get(`getIngredients/${params.fid}`)])
  const res = await get(`getFood/${params.fid}`)

    
  return (
    <div>
      <Food res={res}  params={params} />
    </div>
  )
}

export default page