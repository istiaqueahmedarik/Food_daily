import { get } from "@/action";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getImage } from "@/util";

async function FoodCard({ params,profile=false }) {
    const res = await get(`getFoods/${params.cid}`)
    const data = res.result
    const others = res.others;
    const blurImg = await getImage();


    return (
        <div className="flex flex-wrap gap-2 m-5">
            {data.map((food, idx) => {
                return (
                    <Link href={profile === true ? `/chef/my/food/${food['ID']}/ingredient` : `/chef/kitchen/food/${food['ID']}`} key={idx} className='rounded-lg  bg-card text-card-foreground shadow-sm max-w-xl mx-auto ' >
                    
                        <Card className="w-full max-w-sm overflow-hidden">
                            <div className="relative">
                                <Image blurDataURL={blurImg}  placeholder='blur' sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                                    quality={60}
                                    width={400}
                                    height={300}
                                    src={food['FOOD_IMAGE']}
                                    alt={food['NAME']}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background to-foreground opacity-50"></div>
                                <div className="absolute bottom-4 left-4 right-4">
                                    <h2 className="text-2xl font-bold text-foreground mb-2">{food['NAME']}</h2>
                                    
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <p className="text-sm  mb-4 text-foreground">
                                    {food['DESCRIPTION']}
                                </p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-foreground mr-1"
                                        >
                                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                                        </svg>
                                        <span className="font-bold">{food['RATING']}</span>
                                        {/* <span className="text-gray-600 ml-1">(128 reviews)</span> */}
                                    </div>
                                    <span className="text-lg font-bold">৳{food['PRICE']}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                )
            })}

        </div>
    )
}

export default FoodCard



