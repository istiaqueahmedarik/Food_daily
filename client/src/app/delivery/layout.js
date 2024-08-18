import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

function layout({ children }) {
  if(cookies().get('token') == undefined){
    redirect('/login')
  }
  return (
      <div>
          <div className='h-20'></div>
          {children}
    </div>
  )
}

export default layout