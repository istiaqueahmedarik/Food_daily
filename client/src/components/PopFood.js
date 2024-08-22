import { get } from '@/action'
import Image from 'next/image';
import React from 'react'
import { Card, CardContent } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';

async function PopFood() {
    const res = await get('popularFood/72'); 
    const popularFoods = res.result;
    
  return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularFoods.map((food, index) => (
              <Link href={`/chef/kitchen/food/${food['ID']}`} key={index}>
                  <Card>
                      <CardContent className="pt-6">
                          <div className="relative">
                              <Image
                                  width={500}
                                    height={500}
                                  src={food['FOOD_IMAGE']}
                                  alt={food['NAME']}
                                  className="w-full h-48 object-cover rounded-md mb-2"
                              />
                              <Avatar className="absolute bottom-0 right-0 transform translate-y-1/2 translate-x-1/2 border-4 border-background">
                                  <AvatarImage src={food['PROFILE_IMAGE']} alt={food['NAME']} />
                                  <AvatarFallback>{food['CHEF_NAME'][0]}</AvatarFallback>
                              </Avatar>
                          </div>
                          <h3 className="font-semibold text-lg mt-4">{food['NAME']}</h3>
                          <p className="text-sm text-muted-foreground">{food['DESCRIPTION']}</p>
                          <p className="text-sm font-medium mt-2">৳{food['PRICE']}</p>
                      </CardContent>
                  </Card>
                </Link>
          ))}
      </div>
  )
}

export default PopFood