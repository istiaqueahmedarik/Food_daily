import Image from 'next/image'
import React, { Suspense } from 'react'
import Feauture__card from './ui/Feauture__card'
import LoadingCard from './ui/LoadingCard'

async function Feature() {
  return (
      <div>
            <h1 className='text-center text-3xl font-bold p-5'>Our Features</h1>
      <div className='flex flex-wrap p-5'>
        <Suspense fallback={<LoadingCard/>}>
          <Feauture__card img='/delivery.svg' title='Fast Delivery' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus.' link="/apply_delivery" linkText="Become A Delivery Worker" type="delivery" />
        </Suspense>
        <Suspense fallback={<LoadingCard/>}>

          <Feauture__card img='/food.svg' title='Quality Food' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus.' link="/search" linkText="Buy Good Food" type="food" />
        </Suspense>

          <Suspense fallback={<LoadingCard/>}>

          <Feauture__card img='/chef.svg' title='Best Chefs' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus.' link="/apply_chef" linkText="Become A Chef" type="chef" />
        </Suspense>

            <Suspense fallback={<LoadingCard/>}>

          <Feauture__card img='/qa.svg' title='Quality Assurance' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus.' link="/qa" linkText="Apply for QA Officer" type="qa" />
        </Suspense>

          </div>
     </div>
  )
}

export default Feature