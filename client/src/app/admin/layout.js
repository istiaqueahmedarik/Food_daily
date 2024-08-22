import AdminNavbar from '@/components/AdminSection/AdminNavBar'
import React from 'react'

function layout({children}) {
  return (
    <div>
      <AdminNavbar />
          <div className='h-20'></div>
            {children}
    </div>
  )
}

export default layout