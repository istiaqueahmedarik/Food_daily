import ApplyKitchen from "@/components/ApplyKitchen"
import { getBlur } from "@/util"
import Image from "next/image"
export const experimental_ppr = true;

function page() {
    return (
        <div className="m-auto w-full">
            <div className="h-20"></div>
            <div className="justify-center grid grid-cols-2 place-content-center m-auto">
                <ApplyKitchen />
                <Image blurDataURL={getBlur()} placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"  src="/apply_kitchen.svg" width="700" height="700" alt="Kitchen" className="rounded-lg object-cover" />
            </div>
        </div>
    )
}

export default page