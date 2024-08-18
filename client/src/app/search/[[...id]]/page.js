import { post } from '@/action';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card'
import { StarIcon } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

async function page({ params, searchParams }) {
    const res = await post('search', searchParams);
    if (res.result.length === 0) {
        return <div className="text-center">No results found</div>
    }
  
  return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {res.result.map((item, index) => (
                  <Card >
                  <CardContent className="p-4">
                      <Link key={index} href={`/chef/kitchen/food/${item['FOOD_ID']}`}>

                          <Image src={item['FOOD_IMAGE']} alt={item['NAME']} className="w-full h-40 object-cover mb-4 rounded" width={500} height={500} quality={60} />
                          <h2 className="font-semibold text-xl">{item['NAME']}</h2>
                </Link>

                      <Link href={`chef/kitchen/${item['KITCHEN_ID']}`} className="text-md text-gray-300">{item['KITCHEN_NAME']}</Link>
                      <div className="flex justify-between items-center mt-2">
                          <Link href={"/"} className="text-sm text-gray-500 flex flex-wrap">
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
                                  <span>{item['RATING']}</span>
                              </div>
                          </div>
                      </CardContent>
                  </Card>
          ))}
      </div>
  )
}

export default page