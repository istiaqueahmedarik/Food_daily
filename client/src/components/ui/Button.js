'use client'
import React from 'react'
import { useFormStatus } from 'react-dom'
import { Button3 } from './button3'
function Button({ className,txt="Submit",variant,disabled=false}) {
    const { pending } = useFormStatus()
    return (
        <>
        {
                !disabled ? (<Button3
                    className={className}
          type = "submit"
      disabled = { pending }
      variant = { variant }

            >
            { pending ? 'Loading...' : txt }
                </Button3>) : (<Button3
                        className={className}
        type="submit"
        disabled={true}
        variant={variant}

    >
        Not Now
    </Button3>) }
        </>

  )
}

export default Button