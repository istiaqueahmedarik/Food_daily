import { get_with_token, uploadImage } from "@/action"
import CertList from "@/components/CertList";
import ChefProfile from "@/components/ChefProfile";
import Personal from "@/components/Personal";
import Image from "next/image";
import Link from "next/link";

export const runtime = 'edge'


async function page() {
  const res = await get_with_token('jwt/chefDetails');

  return (
    <div className="flex flex-col gap-8">
      <div className="h-[100vh] m-auto grid place-content-center">
          <Personal res={res}/>
      </div>
      {(res.result[0]['CHEF_ID'] !== undefined && res.result[0]['CHEF_ID']!==null) && <ChefProfile mine={true} chef={res} />}
      
    </div>
  )
}

export default page

