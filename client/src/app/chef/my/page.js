import { get_with_token, post_with_token } from "@/action"
import CertList from "@/components/CertList"
import ChefProfile from "@/components/ChefProfile"
import ChefsOrder from "@/components/ChefsOrder";
import { Star } from "lucide-react"

export const experimental_ppr = true;
  
async function page() {

  const [chef, res] = await Promise.all([get_with_token('jwt/chefDetails'), get_with_token('jwt/getCertifications')])
    

  return (
    <div className="bg-background">
          {/* {user.result[0]['NAME']['FIRST_NAME']} {user.result[0]['NAME']['LAST_NAME']} {user.result[0]['RATING']} <Star size={30} /> */}
          <ChefProfile profile={true} chef={chef}/>

      <CertList chef={chef} res={res} />
    </div>
  )
}

export default page