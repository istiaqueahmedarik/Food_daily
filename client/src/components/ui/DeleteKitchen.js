'use client'
import { deleteKitchen } from '@/action'
import { Check, Delete, LoaderPinwheel, X } from 'lucide-react'
import React from 'react'
import { useFormStatus } from 'react-dom'
async function DeleteKitchen({ edit, profile }) {
    const { pending } = useFormStatus()
    const [status, setStatus] = React.useState(false);
    const clk = async (e) => { 
        e.preventDefault();
        setStatus((prev) => !prev)
    }
    const binded = deleteKitchen.bind(null, edit)
    return (
            <>
                {status ? (
                <>
                        <button
                            onClick={clk}
                            className=""
                        >
                            <X size={24} className="mr-2" />
                        </button>
                    <form action={binded}>
                        <button
                            type='submit'
                            className=""
                            disabled={pending}
                        >
                            {pending ? <LoaderPinwheel size={24} className='mr-2' /> : <Check size={24} className="mr-2" />}
                        </button>
                    </form>
                        
                        
                </>
                ) : (
                    <>
                        
                            <button
                                onClick={clk}
                                className=""
                            >
                                <Delete size={24} className="mr-2" /> 
                            </button>

                    </>
                )}
            </>
        )
    }
     

export default DeleteKitchen