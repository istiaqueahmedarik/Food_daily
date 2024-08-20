import { get, post, post_with_token, searchFood } from "@/action"
import { ArrowRight, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"

async function layout({ params, children }) {
    const [res,rating] = await Promise.all([post('getKitchen', { kitchenId: params.id }), get(`getKitchenRating/${params.id}`)])
    const data = res.result[0]
    const img = res.image
    const front = img.length > 0 ? img[0]['IMAGE'] : '/food.svg'

    async function searchFood(formData)
    {
        'use server'
        const search = formData.get('search')
        const city = data['KITCHEN_CITY_NAME']
        const chef_name = data['FIRST_NAME'] + ' ' + data['LAST_NAME']
        // ?city=DHAKA&chef=Istiaque%20Ahmed&kitchen=Hungry%20hungry&price=34,235
        const query = `?city=${city}&chef=${chef_name}&kitchen=${data['KICHEN_NAME']}&search=${search}`
        redirect(`/search${query}`)
    }
    
    
  return (
      <div>
          <div className='h-20'></div>
        
              <div class="grid grid-cols-2 items-center w-full max-w-6xl p-4 mx-auto space-x-4 bg-background rounded-lg shadow-lg border border-input">
              <div class="flex flex-col p-8 space-y-4 bg-background border border-input rounded-lg shadow-lg">
                      <div class="space-y-2">
                      <h1 class="text-3xl font-bold">{data['KICHEN_NAME']}</h1>
                      <Link href={`/chef/${data['CHEF_ID']}`}>
                          <p class="font-thin ">{data['FIRST_NAME']} {data['LAST_NAME']}</p>
                        </Link>
                      <p class="font-thin flex flex-wrap">
                          <span>
                              
                              {data['KITCHEN_CITY_NAME']}, {rating['Rating']}
                          </span>
                          
                          <span className="my-[0.8] mx-1 ">
                              <Star size={17} color="#ffffff93"/>
                          </span>
                      </p>
                      <p class="text-muted-foreground">{data['KITCHEN_ADDRESS']}</p>
                      </div>
                  <form action={searchFood} className="max-w-3xl my-auto text-center">
                      <div className="relative mb-4">
                          <input
                              type="text"
                              placeholder="Search..."
                              className="w-full py-3 px-4 pr-12 rounded-md border-[0.5px] border-input bg-background text-foreground focus:outline-input outline-none"
                              name="search"
                          />
                          <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-foreground text-background p-2 rounded-full">
                              <ArrowRight size={20} />
                          </button>
                      </div>
                      

                  </form>
                  </div>
              <Image sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  quality={60}  src={front} alt="restaurant" class="object-cover w-full h-96 rounded-lg shadow-lg " width={500} height={500} />
          </div>
          {children}
    </div>
  )
}

export default layout