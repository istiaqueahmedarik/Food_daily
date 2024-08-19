import React from 'react'
import { Card, CardContent } from './ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { StarIcon } from 'lucide-react'
import { getImage, getSvg } from '@/util'

async function SearchGridCard({ item }) {
    const image = await getImage(item['FOOD_IMAGE']);
  return (
      <Card>
          <CardContent className="p-4">
              <Link href={`/chef/kitchen/food/${item['FOOD_ID']}`}>

                  <Image src={item['FOOD_IMAGE']} alt={item['NAME']} className="w-full h-40 object-cover mb-4 rounded" width={500} height={500} blurDataURL={image} placeholder='blur'/>
                  <h2 className="font-semibold text-xl">{item['NAME']}</h2>
              </Link>

              <Link href={`chef/kitchen/${item['KITCHEN_ID']}`} className="text-md text-gray-300">{item['KITCHEN_NAME']}</Link>
              <div className="flex justify-between items-center mt-2">
                  <Link href={`/chef/${item['CHEF_ID']}`} className="text-sm text-gray-500 flex flex-wrap">
                      <Avatar>
                          <AvatarImage src={item['PROFILE_IMAGE']} alt="alt={item['CHEF_NAME']}" />
                          <AvatarFallback>{item['CHEF_NAME'][0]}{item['CHEF_NAME'][1]}</AvatarFallback>
                      </Avatar>
                      <span className='my-auto mx-2'>
                          {item['CHEF_NAME']}
                      </span>

                  </Link>
                  <div className="flex items-center">

                      <Link href={`/search?city=${item['CITY_NAME']}`} className="text-sm text-gray-500">City: {item['CITY_NAME']}</Link>
                  </div>
              </div>
              <div className="flex justify-between items-center mt-2">
                  <span className="font-bold">৳{item['PRICE']}</span>
                  <div className="flex items-center">
                      <StarIcon className="w-4 h-4 text-background fill-foreground mr-1" />
                      <span>{item['RATING'] ? item['RATING']:0}</span>
                  </div>
              </div>
          </CardContent>
      </Card>
  )
}

export default SearchGridCard