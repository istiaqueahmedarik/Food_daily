import { get_with_token } from '@/action'
import AdminAdd from '@/components/AdminSection/AdminAdd';
import QaApprove from '@/components/AdminSection/QaApprove';
import QAcard_ from '@/components/QAcard_'
import LoadingCard from '@/components/ui/LoadingCard';
import { redirect } from 'next/navigation'
import React, { Suspense } from 'react'
export const experimental_ppr = true;

async function page() {
    
  return (
      <div>
          <Suspense fallback={<LoadingCard/>}>
              <QaApprove />
            </Suspense>
          <Suspense fallback={<LoadingCard/>}>
          <AdminAdd />
            </Suspense>
    </div>
  )
}

export default page