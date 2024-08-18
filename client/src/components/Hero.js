import { ArrowRight, Beef, CroissantIcon, HandPlatter, Heater, Pizza, Search, Soup, User } from "lucide-react"
import Image from "next/image"
import NavBar from "./NavBar"
import Link from "next/link"
import { cookies } from "next/headers"
import HeroCover from "./HeroCover"

export const dynamic = 'force-static';

function Hero() {
    return (
      
        
      <div className="min-h-screen relative  text-white ">
            
          <div className="grid place-content-center h-[80vh]">
              <form className="max-w-3xl my-auto mx-auto text-center">
                  <h1 className="text-4xl  mb-8">Discover Home cooked food and more...</h1>
                  <div className="relative mb-4">
                      <input
                          type="text"
                          placeholder="Enter delivery address"
                          className="w-full py-3 px-4 pr-12 rounded-md border-[0.2px] border-[#ffffff21] bg-background text-white focus:outline-[#ffffff25] outline-none"
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white text-black p-2 rounded-full">
                          <ArrowRight size={20} />
                      </button>
                  </div>
                  {cookies().get('token') ? (
                      <button type="submit" className="flex items-center justify-center mx-auto text-[#ffffff9d] border bg-background rounded-md border-[#ffffff39] hover:text-white px-4 py-2">
                      <Search size={20} className="mr-2" />
                      Search
                  </button>
                  ) : (
                          <Link href={"/login"} className="flex items-center justify-center mx-auto text-[#ffffff9d] border bg-background rounded-md border-[#ffffff39] hover:text-white px-4 py-2">
                              <User size={20} className="mr-2" />
                              Sign in
                          </Link>   
                  )}
                  
              </form>
          </div>

              <div className="absolute bottom-0 left-[5rem] w-1/4">
                  {/* <Image src="/vercel.svg" alt="Food plate" width={500} height={500} className="rounded-full" /> */}
                  <Beef size={300} strokeWidth={0.2} className="text-input"/>
              </div>

          <div className="absolute top-20 left-12 w-1/6">
                  {/* <Image src="/vercel.svg" alt="Smartphone" width={500} height={500} className="transform -rotate-12" /> */}
              <Heater size={300} strokeWidth={0.2} className="text-input" />
              </div>

          <div className="absolute bottom-10 right-10 w-1/4">
                  {/* <Image src="/vercel.svg" alt="Tacos" width={500} height={500}  className="rounded-lg" /> */}
              <CroissantIcon size={300} strokeWidth={0.1} className="text-input" />
              </div>

          <div className="absolute top-20 right-20 w-1/6">
                  {/* <Image src="/vercel.svg" width={500} height={500} alt="Candy" className="rounded-full" /> 
              */}
              <Pizza size={300} strokeWidth={0.2} className="text-input" />
          </div>

          <div className="absolute bottom-0 left-[40%] w-1/6">
              {/* <Image src="/vercel.svg" width={500} height={500} alt="Candy" className="rounded-full" /> 
              */}
              {/* <HandPlatter size={300} strokeWidth={0.2} className="text-input" /> */}
          </div>
          
      </div>
  )
}

export default Hero