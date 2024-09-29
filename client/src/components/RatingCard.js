import React from 'react'
import Rating from './Rating'
import { get, post_with_token } from '@/action'
import { FoodReportCta } from './food-report-cta';

async function RatingCard({fid}) {
    const res = await post_with_token('jwt/isOrder', { fid: fid })
  const status = res.status ? res.status : false;
  const data = await get(`getRating/${fid}`);
  return (
    <div>

      <Rating fid={fid} status={status} data={data} />
    </div>
  )
}

export default RatingCard