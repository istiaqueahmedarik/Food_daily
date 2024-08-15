import { checkout, get_with_token } from '@/action';
import Button from '@/components/ui/Button';
import { Button3 } from '@/components/ui/button3'
import React from 'react'

async function page() {
    const res = await get_with_token('jwt/chefDetails');
    const res2 = await get_with_token('jwt/getCart');
    const price = res2.sm[0]['TOTAL'];
  return (
      <div>
          <div className='h-20'></div>
          <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
              <div className="relative py-3 sm:max-w-5xl sm:mx-auto w-full px-4">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#565656] to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                  <div className="relative px-4 py-10 bg-background shadow-lg sm:rounded-3xl sm:p-20 border border-input">
                      <h1 className="text-2xl font-semibold mb-6 text-center">Payment Details</h1>
                      <form action={checkout} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-6">
                              <div>
                                  <h2 className="text-xl font-semibold mb-4">Order Information</h2>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div className="flex flex-col">
                                          <label className="leading-loose">Total Amount</label>
                                          <div className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-300 border-input">
                                              {price}
                                            </div>
                                      </div>
                                      <div className="flex flex-col">
                                          <label className="leading-loose">Currency</label>
                                          <input type="text" name="currency" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-300 border-input" placeholder="BDT" defaultValue={"BDT"}/>
                                      </div>
                                  </div>
                                 
                                 
                              </div>

                              <div>
                                  <h2 className="text-xl font-semibold mb-4">Customer Information</h2>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div className="flex flex-col">
                                          <label className="leading-loose">Name</label>
                                          <div className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-300 border-input">
                                              {res.result[0]['FIRST_NAME']} {res.result[0]['LAST_NAME']}
                                              </div>
                                      </div>
                                      <div className="flex flex-col">
                                          <label className="leading-loose">Email</label>
                                          <div className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-300 border-input whitespace-nowrap truncate">
                                                {res.result[0]['EMAIL']}
                                          </div>
                                      </div>
                                  </div>
                                  <div className="flex flex-col mt-4">
                                      <label className="leading-loose">Phone</label>
                                      <div className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-300 border-input">
                                            {res.result[0]['CITY_CODE']} {res.result[0]['MOBILE']}
                                      </div>
                                  </div>
                                  <div className="flex flex-col mt-4">
                                      <label className="leading-loose">Address</label>
                                      <div className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-300 border-input break-words">
                                            {res.result[0]['ADDRESS']}
                                      </div>
                                  </div>
                                  
                              </div>
                          </div>

                          <div className="space-y-6">
                              <div>
                                  <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                      <div className="flex flex-col">
                                          <label className="leading-loose">Name</label>
                                          <input  type="text" name="ship_name" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-300 border-input" placeholder="Customer Name" />
                                      </div>
                                      <div className="flex flex-col">
                                          <label className="leading-loose">Address</label>
                                          <input type="text" name="ship_add1" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-300 border-input" placeholder="Dhaka" />
                                      </div>
                                  </div>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                      <div className="flex flex-col">
                                          <label className="leading-loose">City</label>
                                          <input type="text" name="ship_city" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-300 border-input" placeholder="Dhaka" />
                                      </div>
                                      <div className="flex flex-col">
                                          <label className="leading-loose">Country</label>
                                          <input type="text" name="ship_country" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-300 border-input" placeholder="Bangladesh" />
                                      </div>
                                  </div>
                                  <div className="flex flex-col mt-4">
                                      <label className="leading-loose">Postal Code</label>
                                      <input type="text" name="ship_postcode" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-300 border-input" placeholder="1000" />
                                  </div>

                                  <div className="flex flex-col mt-4">
                                      <label className="leading-loose">Shipping Mobile Number</label>
                                      <input type="text" name="ship_mobile" className="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-300 border-input" placeholder="1000" />
                                  </div>
                              </div>

                             
                          </div>

                          <div className="col-span-1 md:col-span-2 pt-4 flex items-center">
                              <Button txt='Pay Now'/>
                          </div>
                      </form>
                  </div>
              </div>
          </div>
      </div>
  )
}

export default page