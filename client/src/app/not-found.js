import { getImage } from '@/util'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

async function NotFound() {
  const image = await getImage();
  return (

    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <Image blurDataURL={image} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
          src="/404.svg"
          width="800"
          height="300"
          alt="404 Illustration"
          className="mx-auto"
          style={{aspectRatio: 300 / 300, objectFit: "cover"}}
        />
        <h1 className="mt-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Oops, page not found!</h1>
        <p className="mt-4 text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist. It might have been moved or deleted.
        </p>
        <div className="mt-6">
          <Link
            className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 border border-[#ffffff1e]"
            href="/"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound