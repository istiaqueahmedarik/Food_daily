import Image from 'next/image'
import React from 'react'
import DeleteIng from './ui/DeleteIng'
import { ScrollArea } from './ui/scroll-area'

async function Ingredients({ res, params, profile = false }) {
    
  return (
      <div>
          {res.ingr.length === 0 ? (
              <>
                  {profile ? <Image blurDataURL='/blur_food.png' placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60} src={"/food.svg"} width={500} height={500} className='m-auto' /> : null}
              </>
          ) : (
              <>
                  <div className='grid grid-cols-[3fr_1fr_1fr_1fr] border m-2 px-4 py-5 rounded-2xl border-input'>
                      <h1>Name</h1>
                      <p>Quantity</p>
                      <p>Calories</p>
                  </div>
                      <ScrollArea className='h-52'>
                          {res.ingr.map((ing, idx) => {
                              return (
                                  <div key={idx} className='grid grid-cols-[3fr_1fr_1fr_1fr] border m-2 px-4 py-5 rounded-2xl border-input hover:bg-input max-h-20'>
                                      <h1>{ing['NAME']}</h1>
                                      <p>{ing['QUANTITY']}</p>
                                      <p>{ing['CALORIES']}</p>
                                      {profile && <DeleteIng fid={params.fid} iid={ing['ID']} />}
                                  </div>
                              )
                          })}
                        </ScrollArea>
              </>
          )}
    </div>
  )
}

export default Ingredients