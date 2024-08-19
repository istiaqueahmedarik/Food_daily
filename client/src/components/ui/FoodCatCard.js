import { getImage } from '@/util'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

async function FoodCatCard(props) {
    const blurImg = await getImage();
  return (
      <Link href={props.edit ? `/chef/my/add_food/${props.cat['KITCHEN_ID']}/category/${props.cat['ID']}`:`/chef/kitchen/${props.cat['KITCHEN_ID']}/category/${props.cat['ID']}`} className='m-5'>
          <div className="card-shadow rounded-2xl p-0 bg-cover bg-center h-96 relative overflow-hidden">
              <Image blurDataURL={blurImg}  placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60}
                  src={props.cat['CATEGORY_IMAGE']}
                  alt="Background"
                  className="absolute inset-0  h-full object-cover"
                  fill
              />
              <div
                  className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgb(69,69,69)_100%)]"

              >
                  <div className="h-full flex">
                      <div
                          className="leading-none p-6 rounded-2xl mt-auto mb-2 text-4xl font-semibold drop-shadow-sm tracking-tight text-[rgb(246, 246, 246)]"
                      >
                          {props.title}
                          <br />
                          <span className='text-[rgb(188,187,187)]'>
                            {props.subtitle} 
                              {props.cat['NAME']}</span>
                      </div>
                  </div>
              </div>
          </div>

      </Link>
  )
}

export default FoodCatCard