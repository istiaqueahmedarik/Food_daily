import { ArrowRight, Search, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Button3 } from "@/components/ui/button3"
import { Input } from "@/components/ui/input"

export const dynamic = 'force-static';

export default function Hero() {
  async function search(formData) {
    "use server"
    const city = formData.get('city')?.toString().split(' ').join(',') || ''
    redirect(`/search?city=${city}`)
  }

  return (
    <div className="pt-10 min-h-screen relative bg-gradient-to-br from-primary/10 to-secondary/10 text-foreground overflow-hidden">
      <div className="absolute inset-0 bg-[url('/food-pattern.png')] opacity-5"></div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 text-primary">
            Discover Delicious
            <span className="block text-6xl mt-2 text-foreground">Home-Cooked Food</span>
          </h1>
          <p className="text-xl mb-8 text-muted-foreground">Explore a world of flavors, right in your neighborhood</p>
          <form action={search} className="max-w-2xl mx-auto">
            <div className="relative mb-6">
              <Input
                type="text"
                placeholder="Enter your delivery address"
                className="w-full py-6 px-6 pr-12 text-lg"
                name="city"
              />
              <Button3 type="submit" size="icon" className="absolute right-2 top-1/2 transform -translate-y-1/2">
                <ArrowRight className="h-4 w-4" />
              </Button3>
            </div>
            {cookies().get('token') ? (
              <Button3 type="submit" size="lg" className="w-full sm:w-auto">
                <Search className="mr-2 h-5 w-5" />
                Find Delicious Meals
              </Button3>
            ) : (
              <Button3 asChild size="lg" className="w-full sm:w-auto">
                <Link href="/login">
                  <User className="mr-2 h-5 w-5" />
                  Sign in to Explore
                </Link>
              </Button3>
            )}
          </form>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>

      <Image
        src="/dish1.svg"
        alt="Delicious dish"
        width={350}
        height={350}
        className="absolute bottom-10 left-10  hidden lg:block"
      />
      <Image
        src="/dish3.svg"
        alt="Home-cooked meal"
        width={300}
        height={300}
        className="absolute top-20 right-20 rounded-full shadow-xl hidden lg:block"
      />
   
    </div>
  )
}