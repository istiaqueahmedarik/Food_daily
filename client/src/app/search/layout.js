import { get } from '@/action'
import LoadingSearch from '@/components/LoadingSearch'
import SearchSide from '@/components/SearchSide'
import { wait } from '@/util'
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
      <Suspense fallback={<LoadingSearch/>}>
        <SearchSide cities={cities} chefs={chefs} kitchens={kitchens} prices={prices}>
          {children}
        </SearchSide>
      </Suspense>
    </div>
  )
}

export default layout