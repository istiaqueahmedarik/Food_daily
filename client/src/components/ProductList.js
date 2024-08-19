import React from 'react'
import ProductCard from './ui/ProductCard'
import ProductCardSmall from './ui/ProductCardSmall'
import Link from 'next/link'
import Recommend from './Recommend'
import { get } from '@/action'

async function ProductList() {
  const res = await get('bestSellingFood');
  const bestSellingFood = res.result;
  const len = bestSellingFood.length;
  return (
      <div className='w-full  p-2'>
          <h1 className='text-3xl m-5  font-bold'>
                Best Sellers
          </h1>
          <div className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
        {len >= 1 ? <Link href={`/chef/kitchen/food/${bestSellingFood[0]['ID']}`} className="md:col-span-4 md:row-span-2">
          <ProductCard title={bestSellingFood[0]['NAME']} ammount={bestSellingFood[0]['PRICE']} unit="TK" img={bestSellingFood[0]['FOOD_IMAGE']} />
        </Link> : null}
        {len>=2?
          <Link href={`chef/kitchen/food/${bestSellingFood[1]['ID']}`} className='md:col-span-2 md:row-span-1'>
            <ProductCardSmall title={bestSellingFood[1]['NAME']} ammount={bestSellingFood[1]['PRICE']} unit="TK" img={bestSellingFood[1]['FOOD_IMAGE']} />
          </Link> : null}
        {len>=3?
          <Link href={`chef/kitchen/food/${bestSellingFood[2]['ID']}`} className="md:col-span-2 md:row-span-1">
            <ProductCardSmall title={bestSellingFood[2]['NAME']} ammount={bestSellingFood[2]['PRICE']} unit="TK" img={bestSellingFood[2]['FOOD_IMAGE']} />
        </Link>:null}
          </div>
    </div>
  )
}

export default ProductList