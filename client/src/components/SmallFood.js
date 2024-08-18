import Image from 'next/image'
import React from 'react'

async function SmallFood({res}) {
  return (
      <div className="grid grid-cols-2 space-y-1.5 p-6 border rounded-lg m-3 border-[#fff2] hover:bg-[#ffffff09] hover:border-transparent">
          <Image quality={60} src={res.food[0]['FOOD_IMAGE']} className='m-2 rounded-lg' width={200} height={200} />
          <div className='grid place-content-center'>
              <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight m-auto">Name - {res.food[0]['NAME']}</h3>
              <p className="text-sm text-muted-foreground font-extralight">Price - {res.food[0]['PRICE']}</p>
          </div>
      </div>
  )
}

export default SmallFood