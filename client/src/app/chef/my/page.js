import { get_with_token } from "@/action"
import CertList from "@/components/CertList"
import ChefProfile from "@/components/ChefProfile"
import { Star } from "lucide-react"

async function page() {

  
  const [chef, res] = await Promise.all([get_with_token('jwt/chefDetails'), get_with_token('jwt/getCertifications')])
    

  return (
    <div className="dark bg-background">
      <div className="flex flex-row justify-center">
          {/* {user.result[0]['FIRST_NAME']} {user.result[0]['LAST_NAME']} {user.result[0]['RATING']} <Star size={30} /> */}
          <ChefProfile profile={true} chef={chef}/>

      </div>
      <CertList chef={chef} res={res} />
          
    </div>
  )
}

export default page