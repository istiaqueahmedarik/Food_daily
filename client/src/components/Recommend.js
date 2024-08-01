import Link from 'next/link'
import React from 'react'
import ProductCardSmall from './ui/ProductCardSmall'

function Recommend() {
  return (
      <div className='flex flex-row gap-4 m-5 overflow-x-scroll '>
          <Link href={"/"} ><ProductCardSmall title="Hot Spicy Special Burger" ammount="20" unit="TK" /></Link>
          <Link href={"/"} ><ProductCardSmall title="Hot Spicy Special Burger" ammount="20" unit="TK" /></Link>
          <Link href={"/"} ><ProductCardSmall title="Hot Spicy Special Burger" ammount="20" unit="TK" /></Link>
          <Link href={"/"} ><ProductCardSmall title="Hot Spicy Special Burger" ammount="20" unit="TK" /></Link>
          <Link href={"/"} ><ProductCardSmall title="Hot Spicy Special Burger" ammount="20" unit="TK" /></Link>
          <Link href={"/"} ><ProductCardSmall title="Hot Spicy Special Burger" ammount="20" unit="TK" /></Link>
          <Link href={"/"} ><ProductCardSmall title="Hot Spicy Special Burger" ammount="20" unit="TK" /></Link>

      </div>
  )
}

export default Recommend