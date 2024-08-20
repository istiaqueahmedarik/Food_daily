import { Check } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

function Success({message}) {
  return (
      <div className="flex items-center justify-center h-screen dark bg-background">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md p-6 sm:p-8 border-input">
              <div className="flex flex-col items-center justify-center gap-4">
                  <Check className="w-16 h-16 text-primary" />
                  <div className="space-y-2 text-center">
                      <h2 className="text-2xl font-bold">Congratulations!</h2>
                      <p className="text-muted-foreground">{message}</p>
                  </div>
                  <Link
                      className="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input"
                      href="/profile"
                  >
                      View Your Profile
                  </Link>
              </div>
          </div>
      </div>
  )
}

export default Success