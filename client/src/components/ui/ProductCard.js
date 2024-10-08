import Image from 'next/image'
import React from 'react'
import Price from './Price'
import { getImage } from '@/util'

async function ProductCard(props) {
    const blurImg = await getImage();
    return (
        <div className='relative block aspect-square h-full w-full'>
            <div className="group flex h-full w-full items-center justify-center overflow-hidden rounded-lg border bg-background  dark:bg-background relative border-input ">
                <Image blurDataURL={blurImg} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" quality={60} src={props.img} fill  alt={props.title} className="relative  object-cover transition duration-300 ease-in-out group-hover:scale-105" />
                <div className="absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label lg:px-20 lg:pb-[35%]">
                    <Price title={props.title} ammount={props.ammount} unit={props.unit} />
                </div>
            </div>
        </div>
    )
}

export default ProductCard