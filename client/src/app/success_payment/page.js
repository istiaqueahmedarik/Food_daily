import { get_with_token } from '@/action'
import { buttonVariants } from '@/components/ui/button3'
import Success from '@/components/ui/Success'
import { getBlur } from '@/util'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

async function page() {
    const res = await get_with_token('jwt/getOrder');
    const data = res.result[0];
    const date = new Date(data['DATE_ADDED']).toLocaleDateString()+' '+ new Date(data['DATE_ADDED']).toLocaleTimeString();
    
  return (
      <div className='p-5'>
          <div className='h-20'></div>
          <div className='grid grid-cols-2'>
              <div className='m-auto'>
                  <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  src={"/succ_payment.svg"} alt="Success Payment" width={500} height={500} />
              </div>
              <div className="bg-background border border-input p-8 rounded-lg shadow-md max-w-lg w-full m-auto">
                  <div className="text-center mb-8">
                      <svg className="w-16 h-16 text-foreground mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <h1 className="text-2xl font-bold text-foreground">Payment Successful!</h1>
                      <p className="text-muted-foreground">Thank you for your purchase.</p>
                  </div>

                  <div className="border-t border-b border-foreground py-4 mb-6">
                      <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                      <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">Order #:</span>
                          <span className="font-medium">{ data['ID']}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium">{date}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">Total:</span>
                          <span className="font-medium">৳{data['TOTAL']}</span>
                      </div>
                      
                  </div>

                  <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                      <p className="text-muted-foreground">
                          {data['SHIPPING_NAME']}
                      </p>
                        <p className="text-muted-foreground">
                          {data['SHIPPING_ADD']}
                      </p>
                        <p className="text-muted-foreground">
                          {data['SHIPPING_PHONE']}
                        </p>
                  </div>

                  <div className="text-center">
                      <Link href={"/"} className={buttonVariants({ variant: "secondary" })}>
                          Go to Home
                      </Link>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default page