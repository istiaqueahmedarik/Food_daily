import Loading from '@/components/Loading';
import LoadingSearch from '@/components/LoadingSearch';
import SearchGrid from '@/components/SearchGrid';

import React, { Suspense } from 'react'

export const experimental_ppr = true
async function page({ params, searchParams }) {
    
  return (
      <div>
    <Suspense fallback={<LoadingSearch/>}>
            <SearchGrid params={params} searchParams={searchParams} />
      </Suspense>
     </div>
  )
}

export default page