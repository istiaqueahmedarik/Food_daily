import { get_with_token } from '@/action';
import AdminRecent from '@/components/AdminSection/AdminRecent'
import React from 'react'
export const experimental_ppr = true;

async function page() {
  const result = await Promise.all([get_with_token('jwt/logs')]);
  console.log(result[0].result)
  return (
      <div>
      <AdminRecent logData={result[0].result} />
    </div>
  )
}

export default page