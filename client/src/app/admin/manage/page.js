import AdminQaManage from '@/components/AdminSection/AdminQaManage';
import ManageChef from '@/components/AdminSection/ManageChef';
import LoadingCard from '@/components/ui/LoadingCard';
import React, { Suspense } from 'react'
export const experimental_ppr = true;

function page() {
  return (

    <div className="min-h-screen bg-background p-8">

      <div className="grid grid-cols-12 gap-6">


        <Suspense fallback={<div><LoadingCard /></div>}>
          <ManageChef />
        </Suspense>

      <Suspense fallback={<div><LoadingCard/></div>}>
          <AdminQaManage />
        </Suspense>

      </div>
    </div>
  )
}

export default page