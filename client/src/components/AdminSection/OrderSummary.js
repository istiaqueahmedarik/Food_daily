
import React from 'react'

import { get_with_token } from '@/action'
import OrderSummaryContent from './OrderSummaryContent'

async function OrderSummary() {
    const orderData = await get_with_token('jwt/orderStatusSummary');
    
  return (
      <OrderSummaryContent orderData={orderData} />
  )
}

export default OrderSummary