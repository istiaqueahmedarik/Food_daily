import AdminReportWrapper from '@/components/AdminSection/AdminReportWrapper'
import LoadingSection from '@/components/LoadingSection'
import React, { Suspense } from 'react'
export const experimental_ppr = true;
function page() {
  return (
      <div>
          <div className='h-5'></div>
          <h1 className='text-2xl m-4'>Resolve this issues - </h1>
          <Suspense fallback={<div><LoadingSection /></div>}>
              <AdminReportWrapper />
            </Suspense>
    </div>
  )
}

export default page