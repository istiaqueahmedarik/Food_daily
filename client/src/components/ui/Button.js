'use client'
import React from 'react'
import { useFormStatus } from 'react-dom'
import { Button3 } from './button3'
function Button({txt="Submit",variant}) {
    const { pending } = useFormStatus()
  return (
      <Button3
          type="submit"
      disabled={pending}
      variant={variant} 
        
      >
            {pending ? 'Loading...' : txt}
      </Button3>
  )
}

export default Button