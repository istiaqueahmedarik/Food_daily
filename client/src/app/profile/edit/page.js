import { get_with_token } from '@/action';
import EditProfile from '@/components/EditProfile'
import React from 'react'

async function page() {
    const res = await get_with_token('jwt/Profile');
    if(res===undefined) return <div>Loading...</div>
  return (
      <div className='grid place-content-center h-[130vh] m-auto'>
          <EditProfile res={res.result[0]} />
    </div>
  )
}

export default page