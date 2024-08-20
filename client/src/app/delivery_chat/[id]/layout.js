import DeliveryStatus from '@/components/DeliveryStatus'
import React from 'react'

function layout({children}) {
  return (
      <div>
          <div className='h-20'></div>
          <div className="flex h-[87vh] bg-background">
              <DeliveryStatus />
             {children}
          </div>
    </div>
  )
}

export default layout