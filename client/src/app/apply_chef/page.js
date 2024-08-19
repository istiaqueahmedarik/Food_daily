import { applyChef, get_with_token } from "@/action"
import ApplyChef from "@/components/ApplyChef"
import Button from "@/components/ui/Button"
import Image from "next/image"
import { redirect } from "next/navigation"

async function page() {
    const chef = await get_with_token('jwt/getChef')
    if (chef.result!==undefined && chef.result.length>0) 
        redirect('/success')
  return (
      <div className="flex flex-wrap  h-screen w-full m-auto">
          <ApplyChef />
     </div>
  )
}

export default page