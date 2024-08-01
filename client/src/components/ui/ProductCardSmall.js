import Image from 'next/image'
import React from 'react'
import Price from './Price'

function ProductCardSmall(props) {
    return (
        <div className='relative block aspect-square h-full w-full'>
            <div className="group flex h-full w-full m-auto items-center justify-center overflow-hidden rounded-lg border bg-white  dark:bg-black relative border-neutral-200 dark:border-neutral-800">
                <Image width={400} height={200} src={"/food.svg"} alt="Acme Drawstring Bag" className="relative h-full w-full object-contain transition duration-300 ease-in-out group-hover:scale-105" />
                <div className='absolute bottom-3'>
                    <Price title={props.title} ammount={props.ammount} unit={props.unit} />

                </div> 
            </div>
        </div>
          
  )
}

export default ProductCardSmall