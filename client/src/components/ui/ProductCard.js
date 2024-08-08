import Image from 'next/image'
import React from 'react'
import Price from './Price'

function ProductCard(props) {
    return (
        <div className='relative block aspect-square h-full w-full'>
            <div className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-black  dark:bg-background relative border-neutral-200 dark:border-neutral-800">
                <Image src={"/food.svg"} alt="Acme Circles T-Shirt" className="relative h-full w-full object-contain transition duration-300 ease-in-out group-hover:scale-105" width={400} height={400} />
                <div className="absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label lg:px-20 lg:pb-[35%]">
                    <Price title={props.title} ammount={props.ammount} unit={props.unit} />
                </div>
            </div>
        </div>
    )
}

export default ProductCard