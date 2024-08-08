'use client'
import React from 'react'
import { useFormStatus } from 'react-dom'
function Button({txt="Submit"}) {
    const { pending } = useFormStatus()
  return (
      <button
          type="submit"
            disabled={pending}
          className={`w-full bg-background text-[#ffffff6f] hover:text-white font-semibold py-2 px-4 rounded-md border border-[#ffffff1e] transition duration-300 ease-in-out hover:bg-[#ffffff1e]`}
      >
            {pending ? 'Loading...' : txt}
      </button>
  )
}

export default Button