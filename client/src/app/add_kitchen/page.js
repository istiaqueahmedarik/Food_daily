import ApplyKitchen from "@/components/ApplyKitchen"
import Image from "next/image"

function page() {
    return (
        <div className="m-auto w-full">
            <div className="h-20"></div>
            <div className="justify-center grid grid-cols-2 place-content-center m-auto">
                <ApplyKitchen />
                <Image src="/apply_kitchen.svg" width="700" height="700" alt="Kitchen" className="rounded-lg object-cover" />
            </div>
        </div>
    )
}

export default page