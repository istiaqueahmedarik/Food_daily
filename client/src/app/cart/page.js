import React from 'react'
import { deleteCart, get_with_token } from '@/action'
import Image from 'next/image'
import { Badge, Delete } from 'lucide-react'
import { buttonVariants } from "@/components/ui/button3"

import Link from 'next/link'
import { getBlur } from '@/util'


async function page() {
    const res = await get_with_token('jwt/getCart');
    const data = res.result;
    console.log(data)
  return (
      <div className='grid grid-cols-2'>
          <div className='m-auto'>
              <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  src='/cart.svg' width={500} height={500} />
          </div>
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md border-input" >
              <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Your Cart</h3>
                  <p className="text-sm text-muted-foreground">Review and place your order.</p>
              </div>
              <div className="p-6">
                  <div className="grid gap-4">
                      {data.map((food, idx) => { 
                          const binded = deleteCart.bind(null, food['CART_ID']);
                            return (
                                <div key={idx} className="grid grid-cols-[3fr_1fr_0fr] items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-sm font-medium">{food['NAME']}</div>
                                            <div className="text-sm text-muted-foreground">x{food['QUANTITY']}</div>

                                        </div>
                                        <div className="text-sm text-muted-foreground">{new Date(food['DATE_ADDED']).toLocaleDateString()}</div>
                                    </div>
                                    <div className="text-sm font-medium">৳{food['PRICE']*food['QUANTITY']}</div>
                                    <form action={binded}>
                                        <button className="text-sm text-red-500 font-medium" type="submit"><Delete /></button>
                                    </form>
                                </div>
                            )
                      })}
                      
                  </div>
                  <div className={`${data===undefined || data.length===0?'hidden':''}`}>
                      <div data-orientation="horizontal" role="none" className="shrink-0 bg-border h-[1px] w-full my-4 border"></div>
                      <div className="grid grid-cols-[3fr_1fr_0fr] items-center justify-between"
                      >
                          <div className="text-sm font-medium">Total</div>
                          <div className="text-sm font-medium">৳{res.sm[0]['TOTAL']}</div>
                          <div className='w-5'></div>
                      </div>
                      <div className='w-full my-4'>
                          <Link href={"/payment"} className={buttonVariants({ variant: "secondary" })}>
                              Place Order
                          </Link>
                      </div>

                  </div>
                    <div className={`${data===undefined || data.length!==0?'hidden':''}`}>
                        <div className="flex items-center justify-center h-1/2">
                            <p className="text-muted-foreground">Your cart is empty.</p>
                      </div>
                      </div>
                  </div>
          </div>
    </div>
  )
}

export default page