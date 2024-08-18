import { get } from '@/action'
import SearchSide from '@/components/SearchSide'
import React, { Suspense } from 'react'
export const experimental_ppr = true
async function layout({ children }) {

  const [cities,chefs,kitchens,prices] = await Promise.all([
    get('getCities'),
    get('getChefs'),
    get('getAllKitchens'),
    get('getPriceRange')
  ])
  return (
      <div>
      <div className='h-20'></div>
      <Suspense fallback={<div>Loading...</div>}>
        <SearchSide children={children} cities={cities} chefs={chefs} kitchens={kitchens} prices={prices} />
      </Suspense>
    </div>
  )
}

export default layout