import DeliveryStatus from '@/components/DeliveryStatus'
import React from 'react'

function layout({children,params}) {
  return (
      <div>
          <div className='h-20'></div>
          <div className="flex h-[87vh] bg-background">
        <DeliveryStatus oid={params.id} />
             {children}
          </div>
    </div>
  )
}

export default layout