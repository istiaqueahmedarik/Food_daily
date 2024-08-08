import { Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function KitchenCard({name="Hungry", image="/food.svg", address="123, Food Street"}) {
  return (
      <div className="relative w-[300px] h-[400px] rounded-lg overflow-hidden group border border-[#ffffff2d] ">
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(13,17,23,0.95)] via-[rgba(13,17,23,0.75)] to-[rgba(13,17,23,0.1)] z-10"></div>
              <Image
                src={image}
                alt="Stay ahead, always"
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300 backdrop-filter"
                width="300"
                height="400"
                style={{ aspectRatio: 300 / 400, objectFit: "cover" }}
              />
                  <div className="absolute bottom-4 left-4 z-20">
                      
              <h3 className="text-white text-xl font-bold">{name}</h3>
              <h3 className="mr-5 text-white text-sm font-light">{address}</h3>
                <Link href={"/"} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#ffffff2d] pl-5 pr-5 pt-2 pb-2 bg-transparent backdrop-blur-lg">
                  Explore 
                  <Plus size={20} className="ml-2" />
                </Link>
              </div>
            </div>
         
  )
}

export default KitchenCard

