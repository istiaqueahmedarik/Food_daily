import Image from 'next/image'
import React from 'react'
import DeleteIng from './ui/DeleteIng'

async function Ingredients({res, params,profile=false}) {
  return (
      <div>
          {res.ingr.length === 0 ? (
              <>
                  {profile ? <Image quality={60} src={"/food.svg"} width={500} height={500} className='m-auto' /> : null}
              </>
          ) : (
              <>
                  <div className='grid grid-cols-[3fr_1fr_1fr_1fr] border m-2 px-4 py-5 rounded-2xl border-[#fff2]'>
                      <h1>Name</h1>
                      <p>Quantity</p>
                      <p>Calories</p>
                  </div>
                  {res.ingr.map((ing, idx) => {
                      return (
                          <div key={idx} className='grid grid-cols-[3fr_1fr_1fr_1fr] border m-2 px-4 py-5 rounded-2xl border-[#fff2] hover:bg-[#ffffff1b] max-h-20 overflow-y-scroll'>
                              <h1>{ing['NAME']}</h1>
                              <p>{ing['QUANTITY']}</p>
                              <p>{ing['CALORIES']}</p>
                              {profile && <DeleteIng fid={params.fid} iid={ing['ID']} />}
                          </div>
                      )
                  })}
              </>
          )}
    </div>
  )
}

export default Ingredients