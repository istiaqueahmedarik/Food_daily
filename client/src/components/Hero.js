import { ArrowRight, Beef, CroissantIcon, HandPlatter, Heater, Pizza, Search, Soup, User } from "lucide-react"
import Image from "next/image"
import NavBar from "./NavBar"
import Link from "next/link"
import { cookies } from "next/headers"
import HeroCover from "./HeroCover"
import { redirect } from "next/navigation"

export const dynamic = 'force-static';

async function Hero() {
    async function search(formData) {
        "use server"
        const city = formData.get('city').split(' ').join(',')
        redirect(`/search?city=${city}`)
    }
    return (
      
        
      <div className="min-h-screen relative  text-foreground ">
            
          <div className="grid place-content-center h-[80vh]">
                <form action={search} className="max-w-3xl my-auto mx-auto text-center">
                  <h1 className="text-4xl  mb-8">Discover Home cooked food and more...</h1>
                    <div className="relative mb-4">
                        <div class="rounded-lg bg-vc-border-gradient p-px shadow-lg shadow-bactext-background/20">
                                    <input
                                    type="text"
                                    placeholder="Enter delivery address"
                                    className="w-full py-3 px-4 pr-12 rounded-md   bg-background border-none text-foreground focus:outline-none outline-none"
                                    name="city"
                                    />
                        </div>
                      
                      <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-foreground text-background p-2 rounded-full">
                          <ArrowRight size={20} />
                      </button>
                  </div>
                  {cookies().get('token') ? (
                      <button type="submit" className="flex items-center justify-center mx-auto text-muted-foreground border bg-background rounded-md border-input hover:text-foreground px-4 py-2">
                      <Search size={20} className="mr-2 text-foreground" />
                      Search
                  </button>
                  ) : (
                          <Link href={"/login"} className="flex items-center justify-center mx-auto text-muted-foreground border bg-background rounded-md border-input hover:text-foreground px-4 py-2">
                                <User size={20} className="mr-2 text-foreground" />
                              Sign in
                          </Link>   
                  )}
                  
              </form>
          </div>

              <div className="md:block hidden absolute bottom-0 left-[5rem] w-1/4">
                  {/* <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  src="/vercel.svg" alt="Food plate" width={500} height={500} className="rounded-full" /> */}
                  <Beef size={300} strokeWidth={0.2} className="text-input"/>
              </div>

            <div className="md:block hidden absolute top-20 left-12 w-1/6">
                  {/* <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  src="/vercel.svg" alt="Smartphone" width={500} height={500} className="transform -rotate-12" /> */}
              <Heater size={300} strokeWidth={0.2} className="text-input" />
              </div>

            <div className=" md:block hidden absolute bottom-10 right-10 w-1/4">
                  {/* <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  src="/vercel.svg" alt="Tacos" width={500} height={500}  className="rounded-lg" /> */}
              <CroissantIcon size={300} strokeWidth={0.1} className="text-input" />
              </div>

            <div className=" md:block hidden absolute top-20 right-20 w-1/6">
                  {/* <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  src="/vercel.svg" width={500} height={500} alt="Candy" className="rounded-full" /> 
              */}
              <Pizza size={300} strokeWidth={0.2} className="text-input" />
          </div>

            <div className=" md:block hidden absolute bottom-0 left-[40%] w-1/6">
              {/* <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  src="/vercel.svg" width={500} height={500} alt="Candy" className="rounded-full" /> 
              */}
              {/* <HandPlatter size={300} strokeWidth={0.2} className="text-input" /> */}
          </div>
          
      </div>
  )
}

export default Hero