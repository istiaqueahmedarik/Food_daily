import React, { Suspense } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { getImage, getImages, wait } from '@/util';
import { StarIcon } from 'lucide-react'
import Image from 'next/image';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { post } from '@/action';
import SearchGridCard from './SearchGridCard';
import Loading from './Loading';

async function SearchGrid({ params, searchParams }) {
    const res = await post('search', searchParams);
    if (res.result === undefined || res.result.length === 0) {
        return <div className="text-center">No results found</div>
    }
    
  return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {res.result.map((item, index) => {
              
              return (

                  <Suspense key={index} fallback={<div>loading...</div>}>
                      <SearchGridCard item={item} />
                  </Suspense>
              )
          })}
      </div>
  )
}

export default SearchGrid