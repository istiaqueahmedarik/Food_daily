import { get_with_token } from "@/action"
import ChefProfile from "@/components/ChefProfile"
import { Star } from "lucide-react"

async function page() {

  
  const [chef,res] = await Promise.all([get_with_token('jwt/chefDetails'), get_with_token('jwt/getChef')])
    console.log(chef)

  return (
    <div>
      <div className="h-20"></div>
      <div className="flex flex-row justify-center">
          {/* {user.result[0]['FIRST_NAME']} {user.result[0]['LAST_NAME']} {user.result[0]['RATING']} <Star size={30} /> */}
          <ChefProfile profile={true} chef={chef}/>
        
      </div>
          
    </div>
  )
}

export default page