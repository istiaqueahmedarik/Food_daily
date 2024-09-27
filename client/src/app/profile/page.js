import { get_with_token, uploadImage } from "@/action"
import CertList from "@/components/CertList";
import ChefProfile from "@/components/ChefProfile";
import OrderList from "@/components/OrderList";
import Personal from "@/components/Personal";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

export const experimental_ppr = true


async function page() {
  const res = await get_with_token('jwt/chefDetails');
  
  console.log(res);

  return (
    <div className=" bg-background flex flex-col gap-8">
      <div className="h-[100vh] m-auto grid place-content-center">
        <Suspense fallback={<div>Loading...</div>}>
          <Personal res={res} />
        </Suspense>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <OrderList />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
      {(res.result[0]['CHEF_ID'] !== undefined && res.result[0]['CHEF_ID'] !== null) && <ChefProfile mine={true} chef={res} />}
      </Suspense>
    </div>
  )
}

export default page

