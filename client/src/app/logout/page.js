import Button from "@/components/ui/Button";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation";

export const dynamic = 'force-static';
export const runtime = 'edge'

function page() {
    async function handleSignOut() { 
        'use server'
        cookies().delete('token');
        revalidatePath('/');
        redirect('/login');
    }
  return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm mx-auto max-w-md" >
              <div className="flex flex-col p-6 space-y-1 text-center">
              
                  <LogOutIcon className="mx-auto h-12 w-12 text-primary"/>
                  <p className="text-sm text-muted-foreground">Are you sure you want to sign out of your account?</p>
              </div>
              <div className="p-6">
                  <form action={handleSignOut} className="flex flex-col items-center gap-4">
                      <Button txt="Sign Out"/>
                      <Link className="text-sm text-muted-foreground hover:underline" href="/">
                          Cancel
                      </Link>
                  </form>
              </div>
          </div>
      </div>
  )
}

export default page

function LogOutIcon(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
    )
}