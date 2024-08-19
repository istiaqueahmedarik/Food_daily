import FoodCat from "@/components/FoodCat"
import Loading from "@/components/Loading"
import { Suspense } from "react"
export const experimental_ppr = true;
async function page({ params }) {
    return (
        <div>
            <Suspense fallback={<Loading />}>
                <FoodCat id={params.id} edit={true} />
            </Suspense>
       </div>
    )
}

export default page