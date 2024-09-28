import React from 'react'
import AdminReports from './AdminReports'
import { get_with_token } from '@/action'

async function AdminReportWrapper() {
    const data = await get_with_token('jwt/getReport');
    
  return (
      <div>
          <AdminReports data={data.result} />
    </div>
  )
}

export default AdminReportWrapper