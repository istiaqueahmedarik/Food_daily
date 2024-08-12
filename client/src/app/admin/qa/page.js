import { get_with_token } from '@/action'
import KitchenBtn from '@/components/ui/KitchenBtn'
import { Star } from 'lucide-react'
import { redirect } from 'next/navigation'
import React from 'react'

async function page() {
    const [kitchens] = await Promise.all([get_with_token('jwt/verifyKitchens')])
    if(kitchens.result===undefined) redirect('/profile')
    
  return (
      <div>
          <div className="h-20"></div>
          <h1 className='text-4xl text-center font-bold'>Unapproved Kitchen List</h1>
          <div className="grid gap-4 p-4 sm:p-6 md:p-8">
              
              {kitchens.result.map((kitchen, idx) => { 
                  return (
                      <div key={idx} className="rounded-lg border border-[#ffffff2b] bg-card text-card-foreground shadow-sm grid gap-4">
                          <div className="flex flex-col space-y-1.5 p-6">
                              <div className="flex items-center justify-between">
                                  <div className="font-semibold text-4xl">{kitchen['NAME']}</div>
                                  <div
                                      className="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground text-xs border-[#ffffff25]"

                                  >
                                      Disapproved
                                  </div>
                              </div>
                          </div>
                          <div className="p-6 grid gap-2 text-sm">
                              <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Address:</span>
                                  <span>{kitchen['ADDRESS']}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Rating:</span>
                                  <div className="flex items-center gap-1">
                                      <Star size={15} />
                                      <span>{kitchen['RATING']}</span>
                                  </div>
                              </div>
                              <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">City:</span>
                                  <span>{kitchen['CITY_NAME']}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                  <span className="text-muted-foreground">Chef ID:</span>
                                  <span>{kitchen['CHEF_ID']}</span>
                              </div>
                          </div>
                          <div className="items-center p-6 flex gap-2">
                              <KitchenBtn id={kitchen['ID']} />
                          </div>
                      </div>
                  )
              })}
              
          </div>
    </div>
  )
}

export default page