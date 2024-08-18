import { CheckCheck, CheckCircle2, Delete, PackagePlus, PencilIcon, Plus, PlusCircle, PlusSquareIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { Suspense } from 'react'
import DeleteKitchen from './DeleteKitchen'
export const experimental_ppr = true


function KitchenCard({ name = "Hungry", image = "/food.svg", address = "123, Food Street", edit = "", profile, approved=false }) {
  if(image===null || image===undefined){ image="/food.svg" }
  return (
      <div className="relative w-[300px] h-[400px] rounded-xl overflow-hidden group border border-[#ffffff2d] ">
              <div className="absolute inset-0 bg-gradient-to-b from-[rgba(13,17,23,0.95)] via-[rgba(13,17,23,0.75)] to-[rgba(13,17,23,0.1)] z-10"></div>
      <Image quality={60}
                src={image}
                alt="Stay ahead, always"
                className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300 backdrop-filter"
                width="300"
                height="400"
                style={{ aspectRatio: 300 / 400, objectFit: "cover" }}
              />
      <div className={`${profile ? '' : 'hidden'} absolute opacity-0 group-hover:opacity-100 transition-all duration-700 top-4 right-4 z-20 flex flex-wrap gap-5`}>
        
        <Suspense fallback={<div>Loading...</div>}>
          <DeleteKitchen edit={edit} profile={profile} />
        </Suspense>
        <Link href={`/chef/kitchen/edit/${edit}`} className={`${profile ? '' : 'hidden'}`}>
          <PencilIcon size={20} className="text-white" />
        </Link>
      </div>
      <div className="absolute bottom-4 left-4 z-20">
        <h3 className="text-white text-xl font-bold flex flex-wrap gap-2">{name}<span>
        {approved && <CheckCircle2 size={20}/>}
        </span></h3>
        <h3 className="mr-5 text-white text-sm font-light">{address}</h3>
        <Link href={profile ? `/chef/my/${edit}`:`/chef/kitchen/${edit}`} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-[#ffffff2d] pl-5 pr-5 pt-2 pb-2 bg-transparent backdrop-blur-lg">
          Explore
          <Plus size={20} className="ml-2" />
        </Link>
      </div>
            </div>
         
  )
}

export default KitchenCard


const AddBurgerIcon = ({ size = 24, color = 'currentColor' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Bottom bun */}
      <path d="M4 18C4 18 4 16 12 16C20 16 20 18 20 18" />
      <path d="M4 18C4 20 5.8 20 12 20C18.2 20 20 20 20 18" />

      {/* Patty */}
      <path d="M4 14C4 14 4 12 12 12C20 12 20 14 20 14" />

      {/* Top bun */}
      <path d="M4 10C4 8 5.8 6 12 6C18.2 6 20 8 20 10" />
      <path d="M4 10C4 10 4 12 12 12C20 12 20 10 20 10" />

      {/* Larger plus sign */}
      <circle cx="18" cy="6" r="5" fill={color} stroke="none" />
      <line x1="18" y1="3" x2="18" y2="9" stroke="white" strokeWidth="2" />
      <line x1="15" y1="6" x2="21" y2="6" stroke="white" strokeWidth="2" />
    </svg>
  );
};