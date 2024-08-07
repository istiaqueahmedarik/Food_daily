import Image from 'next/image'
import React from 'react'
import Feauture__card from './ui/Feauture__card'

function Feature() {
  return (
      <div>
            <h1 className='text-center text-3xl font-bold p-5'>Our Features</h1>
          <div className='flex flex-wrap p-5'>
              <Feauture__card img='/delivery.svg' title='Fast Delivery' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus.' link="/" linkText="Become A Delivery Worker" />
              <Feauture__card img='/food.svg' title='Quality Food' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus.' link="/" linkText="Buy Good Food" />
        <Feauture__card img='/chef.svg' title='Best Chefs' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus.' link="/apply_chef" linkText="Become A Chef" />
              <Feauture__card img='/qa.svg' title='Quality Assurance' description='Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec purus.' link="/" linkText="Apply for QA Officer" />
          </div>
     </div>
  )
}

export default Feature