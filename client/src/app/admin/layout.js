import { get_with_token } from '@/action'
import AdminNavbar from '@/components/AdminSection/AdminNavBar'
import AdminTop from '@/components/AdminSection/AdminTop'

import React, { Suspense } from 'react'

async function layout({ children }) {
 
  return (
    <div>
      <AdminNavbar />
          <div className='h-20'></div>
      <Suspense fallback={<div>Loading...</div>}>
        <AdminTop />
      </Suspense>
      {children}

    </div>
  )
}

export default layout