import { addIngredient, get } from '@/action'
import Button from '@/components/ui/Button'
import DeleteIng from '@/components/ui/DeleteIng';
import Image from 'next/image'
import React, { Suspense } from 'react'
import Ingredients from '@/components/Ingredients'

async function page({ params }) {
    const binded = addIngredient.bind(null, params.fid);
    const res = await get(`getIngredients/${params.fid}`)

  return (
      <div className='grid grid-cols-2'>
          <div className={`${res.ingr.length===0?'m-auto':'m-2'}`}>
                  <Ingredients res={res} params={params} profile={true} />
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md mx-auto border-[#ffffff2e]" >
              <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Add New Ingredient</h3>
                  <p className="text-sm text-muted-foreground">Fill out the form to create a new ingredient record.</p>
              </div>
              <div className="grid grid-cols-2 space-y-1.5 p-6 border rounded-lg m-3 border-[#fff2] hover:bg-[#ffffff09] hover:border-transparent">
                  <Image quality={60} src={res.food[0]['FOOD_IMAGE']} className='m-2 rounded-lg' width={200} height={200} />
                  <div className='grid place-content-center'>
                      <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight m-auto">Name - {res.food[0]['NAME']}</h3>
                      <p className="text-sm text-muted-foreground font-extralight">Price - { res.food[0]['PRICE']}</p>
                  </div>
              </div>
              <form action={binded} className="p-6 grid gap-4">
                  
                  <div className="grid gap-2">
                      <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          for="name"
                      >
                          Name
                      </label>
                      <input
                          className="flex h-10 w-full rounded-md border border-[#ffffff2e] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          id="name"
                          placeholder="Enter the ingredient name"
                          maxlength="255"
                          type="text"
                          name='name'
                      />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                          <label
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              for="quantity"
                          >
                              Quantity
                          </label>
                          <input
                              className="flex h-10 w-full rounded-md border border-[#ffffff2e] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              id="quantity"
                              placeholder="Enter the quantity"
                              type="number"
                              name='quantity'
                          />
                      </div>
                      <div className="grid gap-2">
                          <label
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              for="calories"
                          >
                              Calories
                          </label>
                          <input
                              className="flex h-10 w-full rounded-md border border-[#ffffff2e] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              id="calories"
                              placeholder="Enter the calories"
                              type="number"
                              name='calories'
                          />
                      </div>
                     
                  </div>
                  <div className='w-full'>
                      <Button />
                  </div>
              </form>
          </div>
    </div>
  )
}

export default page