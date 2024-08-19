'use client'
import { applyChef } from '@/action'
import React, { useActionState } from 'react'
import Button from './ui/Button';
import Image from 'next/image';
const prevState = {
    message: '',
}
function ApplyChef() {
    const [state, formAction] = useActionState(applyChef, prevState);
  return (
      <>
          <div className="m-auto">
              <Image blurDataURL='/blur_food.png' placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  src="/apply_chef.svg" alt="Chef" width={500} height={500} />
          </div>
          <form action={formAction} className="m-auto rounded-lg border border-[#ffffff26] bg-card text-card-foreground shadow-sm w-full max-w-md" >
              <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Chef Profile</h3>
                  <p className="text-sm text-muted-foreground">Fill out your chef profile details.</p>
              </div>
              <div className="p-6 space-y-4">
                  <div className="space-y-2">
                      <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          for="name"
                      >
                          Chef Name
                      </label>
                      <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          id="name"
                          placeholder="Enter your Chef Name (Unique and can't be changed)"
                          maxlength="100"
                          name="name"
                          required
                      ></input>
                  </div>
                  <div className="space-y-2">
                      <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          for="specialty"
                      >
                          Specialty
                      </label>
                      <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                          id="specialty"
                          placeholder="Enter your specialty (up to 100 characters)"
                          maxlength="100"
                          name="speciality"
                          required
                      ></textarea>
                  </div>

                  <div className="space-y-2">
                      <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          for="experience"
                      >
                          Experience
                      </label>
                      <input
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          id="experience"
                          name="experience"
                          min="0"
                          placeholder="Enter your experience in years"
                          type="number"
                          required
                      />
                  </div>

              </div>
              <div className="flex items-center p-6">
                  <Button />
              </div>
          </form>
    </>
  )
}

export default ApplyChef