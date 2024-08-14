import { get } from "@/action";
import Image from "next/image";
import Link from "next/link";


async function FoodCard({ params,profile=false }) {
    const res = await get(`getFoods/${params.cid}`)
    const data = res.result
    const others = res.others;

    return (
        <div className="flex flex-wrap gap-2 m-5">
            {data.map((food, idx) => {
                return (
                    <Link href={profile === true ? `/chef/my/food/${food['ID']}/ingredient` : `/chef/kitchen/food/${food['ID']}`} key={idx} className='rounded-lg border bg-card text-card-foreground shadow-sm max-w-xl mx-auto border-[#ffffff2e]' >
                        <div className='grid grid-cols-2 space-y-1.5 p-6  rounded-lg m-3 '>
                            <Image quality={60} src={food['FOOD_IMAGE']} className='m-2 rounded-lg' width={200} height={200} />
                            <div className='grid place-content-center'>
                                <h3 className="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight m-auto">{food['NAME']}</h3>
                                <p className="text-sm text-muted-foreground font-extralight">Price - {food['PRICE']}</p>
                            </div>
                        </div>
                    </Link>
                )
            })}

        </div>
    )
}

export default FoodCard

