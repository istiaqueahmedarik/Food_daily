'use client'
import { add_certificate } from "@/action"
import Button from "@/components/ui/Button"
import Image from "next/image"
import { useActionState } from "react"

function page() {
    const [status, formAction] = useActionState(add_certificate, { message: '' });
    return (
        <div>
            <div className="h-20"></div>
            <div className="grid grid-cols-2 m-7">
                <div>
                    <Image src={"/add_cert.svg"} width={500} height={500} alt="Certificate" className="rounded-lg object-cover" />
                </div>
                <div className='h-screen m-auto w-full '>
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-2xl border-[#ffffff1e]" >
                        <div className="flex flex-col space-y-1.5 p-6">
                            <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Create New Certification</h3>
                            <p className="text-sm text-muted-foreground">Fill out the form to add a new certification record.</p>
                        </div>
                        <form action={formAction} className="p-6 grid gap-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <label
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        for="name"
                                    >
                                        Certification Name
                                    </label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff1e]"
                                        id="name"
                                        name="name"
                                        placeholder="Enter certification name"
                                        required
                                    />
                                </div>

                            </div>
                            <div className="grid grid-cols-1 gap-4">

                                <div className="space-y-2">
                                    <label
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        for="link"
                                    >
                                        Certification Link
                                    </label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff1e]"
                                        id="link"
                                        name="link"
                                        placeholder="Enter certification link"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        for="issue-date"
                                    >
                                        Issue Date
                                    </label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff1e]"
                                        id="issue-date"
                                        name="issueDate"
                                        type="date"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        for="expiry-date"
                                    >
                                        Expiry Date
                                    </label>
                                    <input
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff1e]"
                                        id="expiry-date"
                                        name="expiryDate"
                                        type="date"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    for="certificate"
                                >
                                    Certificate Image
                                </label>
                                <input
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff1e]"
                                    id="certificate"
                                    name="certificate"
                                    type="file"
                                    required
                                />
                            </div>
                            <Button />
                        </form>
                        <div>
                            <p className="text-sm text-accent-foreground text-center">{status.message}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page