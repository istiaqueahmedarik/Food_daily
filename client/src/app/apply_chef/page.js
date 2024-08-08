import { applyChef, get_with_token } from "@/action"
import Button from "@/components/ui/Button"
import Image from "next/image"
import { redirect } from "next/navigation"

async function page() {
    const chef = await get_with_token('jwt/getChef')
    if (chef.error === undefined)
        redirect('/success')
  return (
      <div className="flex flex-wrap  h-screen w-full m-auto">
          <div className="m-auto">
               <Image src="/apply_chef.svg" alt="Chef" width={500} height={500} />
          </div>
          <form action={applyChef} className="m-auto rounded-lg border border-[#ffffff26] bg-card text-card-foreground shadow-sm w-full max-w-md" >
              <div className="flex flex-col space-y-1.5 p-6">
                  <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight">Chef Profile</h3>
                  <p className="text-sm text-muted-foreground">Fill out your chef profile details.</p>
              </div>
              <div className="p-6 space-y-4">
                  <div className="space-y-2">
                      <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          for="specialty"
                      >
                          Specialty
                      </label>
                      <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none border-[#ffffff26]"
                          id="specialty"
                          placeholder="Enter your specialty (up to 100 characters)"
                          maxlength="100"
                          name="speciality"
                          required
                      ></textarea>
                  </div>
                      <div className="space-y-2">
                          <label
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              for="experience"
                          >
                              Experience
                          </label>
                          <input
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-background file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 border-[#ffffff26]"
                              id="experience"
                              name="experience"
                              min="0"
                              placeholder="Enter your experience in years"
                              type="number"
                              required
                          />
                      </div>
                     
              </div>
              <div className="flex items-center p-6">
                 <Button/>
              </div>
          </form>
     </div>
  )
}

export default page