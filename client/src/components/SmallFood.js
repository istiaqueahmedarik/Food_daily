import { getImage } from '@/util';
import Image from 'next/image'
import React from 'react'

async function SmallFood({ res }) {
    const blurImg = await getImage();

  return (
      <div className="grid grid-cols-2 space-y-1.5 p-6 border rounded-lg m-3 border-[#fff2] hover:bg-[#ffffff09] hover:border-transparent">
          <Image blurDataURL={blurImg}  placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60} src={res.food[0]['FOOD_IMAGE']} className='m-2 rounded-lg' width={200} height={200} />
          <div className='grid place-content-center'>
              <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight m-auto">Name - {res.food[0]['NAME']}</h3>
              <p className="text-sm text-muted-foreground font-extralight">Price - {res.food[0]['PRICE']}</p>
          </div>
      </div>
  )
}

export default SmallFood