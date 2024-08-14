import { get } from "@/action"
import FoodCard from "@/components/FoodCard";
import Link from "next/link";


async function page({ params }) {
    const res = await get(`getFoods/${params.cid}`)
    const data = res.result
    const others = res.others;

  return (
      <div>
          <FoodCard params={params} profile={true}/>
      </div>
  )
}

export default page

