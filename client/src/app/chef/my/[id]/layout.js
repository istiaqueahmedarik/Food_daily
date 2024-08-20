import { addCategory, post, post_with_token } from "@/action"
import Button from "@/components/ui/Button"
import { getImage } from "@/util"
import { ArrowRight, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

async function layout({ params, children }) {
    const formAction = addCategory.bind(null, params.id)

  return (
      <div>
          <div className='h-20'></div>
          <div className='grid grid-cols-2'>
              <div className='m-auto'>
                  <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60}  src='/foodCat.svg' width={500} height={500} />
              </div>
              <div class="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md border-input m-auto" >
                  <div class="flex flex-col space-y-1.5 p-6">
                      <h3 class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Add New Category</h3>
                      <div>
                          <form action={formAction} className="grid gap-4">
                              <div className="grid gap-2">
                                  <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor="name">Category Name</label>
                                  <input className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-input' id="name" placeholder="Enter category name" name='category' />
                              </div>
                              <div className="grid gap-2">
                                  <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor="description">Description</label>
                                  <textarea className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-input' id="description" placeholder="Enter category description" name='description' />
                              </div>
                              <div className="grid gap-2">
                                  <label className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70' htmlFor="image">Image</label>
                                  <input className='flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-input' type="file" name='categoryImage' />
                              </div>
                              <Button />
                          </form>
                      </div>
                  </div>
              </div>
          </div>
              
          {children}
    </div>
  )
}

export default layout