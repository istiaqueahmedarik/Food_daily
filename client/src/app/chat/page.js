import Chat from '@/components/Chat'
import React from 'react'

function page() {
    const user1 = 'U1';
    const user2 = 'DP21';
  return (
      <div>
          <div className='h-20'></div>
          <h1>Chat Page</h1>
          <Chat user1={user1} user2={user2} />

      </div>
  )
}

export default page