import React from 'react'
import RevenueContent from './RevenueContent'
import { get_with_token } from '@/action';

async function Revenue() {
    let data = await get_with_token('jwt/orderGrowth');
    // data.day ==> should be local date
    data = data.map((d) => {
        return {
            DAY: new Date(d['DAY']).toLocaleDateString(),
            COUNT: d.COUNT
        }
    })
  return (
          <RevenueContent data={data} />
  )
}

export default Revenue