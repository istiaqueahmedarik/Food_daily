import FoodCat from "@/components/FoodCat"
import Loading from "@/components/Loading"
import LoadingSection from "@/components/LoadingSection"
import { Suspense } from "react"

async function page({ params }) {
    return (
        <div>
            <Suspense fallback={<LoadingSection />}>
                <FoodCat id={params.id} />
            </Suspense>
       </div>
    )
}

export default page