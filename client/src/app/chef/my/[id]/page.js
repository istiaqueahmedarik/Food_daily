import ChefsOrder from "@/components/ChefsOrder";
import FoodCat from "@/components/FoodCat"
import Loading from "@/components/Loading"
import LoadingCard from "@/components/ui/LoadingCard";
import { Suspense } from "react"
export const experimental_ppr = true;
async function page({ params }) {
    return (
        <div>
            <Suspense fallback={<Loading />}>
                <FoodCat id={params.id} edit={true} />
            </Suspense>
            <Suspense fallback={<LoadingCard />}>
                <ChefsOrder kid={params.id} />
            </Suspense>
       </div>
    )
}

export default page