import Image from 'next/image'
import React from 'react'
import Price from './Price'
import { getImage } from '@/util'

async function ProductCardSmall(props) {
    const blurImg = await getImage();
    return (
        <div className='relative block aspect-square h-full w-full'>
            <div className="group flex h-full w-full m-auto items-center justify-center overflow-hidden rounded-lg border bg-white  dark:bg-background relative border-neutral-200 dark:border-neutral-800">
                <Image blurDataURL={blurImg} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60} fill src={props.img} alt={props.title} className="object-cover transition duration-300 ease-in-out group-hover:scale-105" />
                <div className='absolute bottom-3'>
                    <Price title={props.title} ammount={props.ammount} unit={props.unit} />

                </div> 
            </div>
        </div>
          
  )
}

export default ProductCardSmall