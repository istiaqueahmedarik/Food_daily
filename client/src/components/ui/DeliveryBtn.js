import { approveDelivery, disapproveDelivery } from '@/action'
import React from 'react'

function DeliveryBtn({ id }) {
    const binded1 = approveDelivery.bind(null, { delivery_id: id })
    const binded2 = disapproveDelivery.bind(null, { delivery_id: id })
    return (
        <div className='flex flex-wrap gap-5'>
            <form action={binded1}>
                <button type='submit' className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 border border-input">
                    Approve
                </button>
            </form>
            <form action={binded2}>
                <button type='submit' className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3 border border-input">
                    Disapprove
                </button>
            </form>
        </div>
    )
}

export default DeliveryBtn