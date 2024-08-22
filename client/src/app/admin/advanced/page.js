import { get_with_token } from '@/action'
import AdvanceQ from '@/components/AdminSection/AdvanceQ'
import React from 'react'
export const experimental_ppr = true;

async function page() {
    const result = await get_with_token('jwt/getTables');
   
  return (
      <div>
          <AdvanceQ tables={result.result} />
    </div>
  )
}

export default page