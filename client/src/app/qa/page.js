import { get_with_token, qa_apply } from '@/action'
import Button from '@/components/ui/Button'
import { getBlur } from '@/util'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import React from 'react'

async function page() {
    const data = await get_with_token('jwt/getQAofficer')
    if (data.error === undefined) 
        redirect('/qa_dashboard/qa')
    
    return (
        <div>
            <div className='h-20'></div>
            <div className='grid grid-cols-2 mx-auto w-full place-content-center'>
                <form action={qa_apply} className="rounded-lg border border-[#ffffff26] bg-card text-card-foreground shadow-sm w-full max-w-xl m-auto">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Apply for QA Officer</h3>
                    </div>
                    <div className="p-6 space-y-4">
                       
                        <div className="space-y-2">
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                for="qualification"
                                required
                            >
                                Academic Qualification
                            </label>
                            <textarea
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                id="qualification"
                                name='qualification'
                                required
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                for="cvLink"
                                required
                            >
                                Curriculum Vitae
                            </label>
                            <input
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                id="cvLink"
                                required
                                type="file"
                                accept='application/pdf'
                                name='cv'

                            />
                        </div>
                    </div>
                    <div className='m-5'>
                        <Button />
                    </div>
                </form>
                <div className='m-auto'>
                    <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60} src='/qa_.svg' width={500} height={500} />
                </div>
            </div>
        </div>
    )
}

export default page