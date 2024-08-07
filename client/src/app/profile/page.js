import { get_with_token, uploadImage } from "@/action"
import ChefProfile from "@/components/ChefProfile";
import Personal from "@/components/Personal";
import Button from "@/components/ui/Button";
import { PencilIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
export const runtime = 'edge'


async function page() {
  const res = await get_with_token('jwt/Profile');
  console.log(res.result[0]['CHEF_ID'])

  return (
    <div className="">
      <div className="h-[80vh] m-auto grid place-content-center">
          <Personal res={res}/>
      </div>
    {res.result[0]['CHEF_ID'] && <ChefProfile mine={true} chef={res} />}
            
      
      
    </div>
  )
}

export default page

