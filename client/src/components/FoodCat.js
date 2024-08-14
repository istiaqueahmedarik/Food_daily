import { get } from '@/action'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import FoodCatCard from './ui/FoodCatCard';

async function FoodCat({id,edit=false}) {
    const data = await get(`getCategories/${id}`);
    const rand = ["Explore Our", "Enjoy Our",];
    const rand2 = ["Amazing ", "Delicious ", "Fresh ", "Yummy ", "Tasty ", "Healthy "];
    
  return (
      <div className='m-5'>
          <h1 className='text-3xl text-center font-bold'>Our Amazing Food Category</h1>
          <div className='grid grid-cols-2'>
              {data.result.map((cat, idx) => {
                  const title = rand[Math.floor(Math.random() * rand.length)];
                  const subtitle = rand2[Math.floor(Math.random() * rand2.length)];
                  return (
                      <FoodCatCard edit={edit} key={idx} cat={cat} title={title} subtitle={subtitle} />
                  )
              })}
          </div>
      </div>
  )
}

export default FoodCat