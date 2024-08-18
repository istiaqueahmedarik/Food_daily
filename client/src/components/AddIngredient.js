'use client'
import { addIngredient } from '@/action';
import React from 'react'
import Button from './ui/Button';
import { useToast } from "@/components/ui/use-toast"
import { ToastAction } from './ui/toast';

function AddIngredient(props) {
    const binded = addIngredient.bind(null, props.params.fid);
    const { toast } = useToast()

    const formAction = async (formData) => { 
        const res = await binded(formData);
        if(res.error===undefined)
            toast({
                title: "Cool!",
                description: res.message,
            })
        else
            toast({
                variant: "destructive",
                title: "Error!",
                description: res.error,
                action: <ToastAction altText="Try again">Try again</ToastAction>,
            })
    }

  return (
      <form action={formAction} className="p-6 grid gap-4">

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
                  required
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
                      required
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
                      required
                  />
              </div>

          </div>
          <div className='w-full'>
              <Button />
          </div>
      </form>
  )
}

export default AddIngredient