import { approveQAofficer } from '@/action'
import { LoaderPinwheel } from 'lucide-react'
import React, { useActionState } from 'react'
import { useFormStatus, useFormState } from 'react-dom'
const prevState = {
  state: 0
}
function Button2({icon,st,id,url="-1"}) {
  const { pending } = useFormStatus()
  const binded = approveQAofficer.bind(null, {
    st: st,
    qa_id: id,
    url: url
  })
  
  return (
    <form action={binded}>
      <button
        type="submit"
        disabled={pending}
        className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3 py-3 border-input`}
      >
        {pending ? <LoaderPinwheel /> : icon}
      </button>
      </form>
  )
}

export default Button2