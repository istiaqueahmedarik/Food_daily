import { get } from "@/action"
import FoodCard from "@/components/FoodCard";
import Link from "next/link";
import { Suspense } from "react";

export const experimental_ppr = true;

async function page({ params }) {
    const res = await get(`getFoods/${params.cid}`)
    const data = res.result
    const others = res.others;

  return (
      <div>
          <Suspense fallback={<div>loading...</div>}>
              <FoodCard params={params} profile={true} />
          </Suspense>
      </div>
  )
}

export default page

