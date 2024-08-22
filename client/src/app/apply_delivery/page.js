import { applyDelivery, post_with_token } from '@/action';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';

async function page() {
    const data = await post_with_token('jwt/getDelivery');
    
    if (data.result.length !== 0)
        redirect('/delivery');
    return (
        <div>
            <div className='h-20'></div>
            <div className="mx-auto max-w-3xl space-y-8 py-8 px-4 sm:px-6 lg:px-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-input to-light-blue-500 shadow-lg transform -skew-y-12 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative bg-background shadow-lg sm:rounded-3xl sm:p-20 border border-input">
                <div className="space-y-4 text-center">
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Become a Delivery Partner</h1>
                    <p className="text-muted-foreground">
                        Join our team of dedicated delivery professionals and earn extra income by delivering food to customers in your area.
                    </p>
                </div>
                <form action={applyDelivery} className="rounded-lg border bg-card text-card-foreground shadow-sm" >
                    <div className="p-6 space-y-6">
                        <div className="grid gap-4">
                            
                            <div className="grid grid-cols-1 gap-4">
                             
                                <div className="space-y-2">
                                    <label
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        htmlFor="driver-license"
                                    >
                                        Driver&apos;s License
                                    </label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        id="driver-license"
                                        required=""
                                            type="file"
                                            name='driver_license'
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="vehicle"
                                >
                                    Vehicle Information
                                </label>
                                <textarea
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        id="vehicle"
                                        name='vehicle'
                                    placeholder="Enter your vehicle details"
                                    required=""
                                ></textarea>
                            </div>
                            <div className="flex items-start gap-2">
                                <Button/>
                            </div>
                        </div>
                    </div>
                </form>
                </div>
            </div>

        </div>
    );
}

export default page;
