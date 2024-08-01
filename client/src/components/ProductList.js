import React from 'react'
import ProductCard from './ui/ProductCard'
import ProductCardSmall from './ui/ProductCardSmall'
import Link from 'next/link'
import Recommend from './Recommend'

function ProductList() {
  return (
      <div className='w-full  p-5 '>
          <h1 className='text-3xl m-5 text-center font-bold'>
                Best Sellers
          </h1>
          <div className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 lg:max-h-[calc(100vh-200px)]">
              <Link href={"/"} className="md:col-span-4 md:row-span-2"><ProductCard title="Hot Spicy Special Burger" ammount="20" unit="TK"/></Link>
              <Link href={"/"} className='md:col-span-2 md:row-span-1'><ProductCardSmall title="Hot Spicy Special Burger" ammount="20" unit="TK" /></Link>
              <Link href={"/"} className="md:col-span-2 md:row-span-1"><ProductCardSmall title="Hot Spicy Special Burger" ammount="20" unit="TK" /></Link>
          </div>
         <Recommend/>
    </div>
  )
}

export default ProductList