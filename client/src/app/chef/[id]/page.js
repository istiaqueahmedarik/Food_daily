import { get_with_token } from "@/action"
import CertList from "@/components/CertList"
import ChefProfile from "@/components/ChefProfile"
import { Star } from "lucide-react"
import { Suspense } from "react"
export const experimental_ppr = true
async function page({params}) {

  
  
  const [chef, res] = await Promise.all([get_with_token('jwt/chefDetails'), get_with_token('jwt/getCertifications')])
    

  return (
    <div className="dark bg-background">
      <div className="flex flex-row justify-center">
        {/* {user.result[0]['FIRST_NAME']} {user.result[0]['LAST_NAME']} {user.result[0]['RATING']} <Star size={30} /> */}
        <Suspense fallback={<div>Loading...</div>}>
          <ChefProfile profile={false} chef={chef} mine={false} path={`getChef/${params.id}`} />
        </Suspense>

      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CertList chef={chef} res={res} mine={false} path={`getChef/${params.id}`} path2={`getCertifications/${params.id}`} />
      </Suspense>
          
    </div>
  )
}

export default page