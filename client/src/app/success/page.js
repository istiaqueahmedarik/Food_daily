import { Check } from "lucide-react"

function page() {
  return (

      <div class="flex items-center justify-center h-screen bg-background">
          <div class="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md p-6 sm:p-8 border-[#ffffff2f]">
              <div class="flex flex-col items-center justify-center gap-4">
                 <Check class="w-16 h-16 text-primary" />
                  <div class="space-y-2 text-center">
                      <h2 class="text-2xl font-bold">Congratulations!</h2>
                      <p class="text-muted-foreground">You have successfully registered for chef with our platform.</p>
                  </div>
                  <a
                      class="inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-[#ffffff2f]"
                      href="/profile"
                  >
                      View Your Profile
                  </a>
              </div>
          </div>
      </div>
  )
}

export default page