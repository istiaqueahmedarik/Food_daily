import { addIngredient, get } from '@/action'
import Button from '@/components/ui/Button'
import DeleteIng from '@/components/ui/DeleteIng';
import Image from 'next/image'
import React, { Suspense } from 'react'
import Ingredients from '@/components/Ingredients'
import AddIngredient from '@/components/AddIngredient';
import SmallFood from '@/components/SmallFood';

export const experimental_ppr = true

async function page({ params }) {

    const res = await get(`getIngredients/${params.fid}`)

  return (
      <div className='grid grid-cols-2'>
          <div className={`${res.ingr.length===0?'m-auto':'m-2'}`}>
              <Suspense fallback={<div>Loading...</div>}>
                  <Ingredients res={res} params={params} profile={true} />
                </Suspense>
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md mx-auto border-input" >
              <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Add New Ingredient</h3>
                  <p className="text-sm text-muted-foreground">Fill out the form to create a new ingredient record.</p>
              </div>
                <Suspense fallback={<div>Loading...</div>}>
                    <SmallFood res={res} params={params} />
                    </Suspense>
             
              <Suspense fallback={<div>Loading...</div>}>
                  <AddIngredient params={params} />
                </Suspense>
          </div>
    </div>
  )
}

export default page