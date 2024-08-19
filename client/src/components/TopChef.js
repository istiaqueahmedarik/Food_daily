import { get } from '@/action';
import React from 'react'
import { Card, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import Link from 'next/link';

async function TopChef() {
    const res = await get('bestSellingChef');
    const topChefs = res.result;
  return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {topChefs.map((chef, index) => (
              <Link href={`/chef/${chef['CHEF_ID']}`} key={index}>
                  <Card>
                      <CardHeader className="text-center">
                          <Avatar className="w-20 h-20 mx-auto">
                              <AvatarImage src={chef['PROFILE_IMAGE']} alt={chef['CHEF_NAME']} />
                              <AvatarFallback>{chef['CHEF_NAME'][0]}</AvatarFallback>
                          </Avatar>
                          <CardTitle className="mt-2">{chef['CHEF_NAME']}</CardTitle>
                          <p className="text-sm text-muted-foreground">{chef['SPECIALITY']} Cuisine</p>
                      </CardHeader>
                  </Card>
                </Link>
          ))}
      </div>
  )
}

export default TopChef