import { get } from '@/action'
import Link from 'next/link'
import Image from 'next/image'
import React, { Suspense } from 'react'
import KitchenCard from './ui/KitchenCard'
import { getImage } from '@/util'
import { Star, StarHalf, ChefHat, Award, MapPin, Utensils } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

async function ChefProfile({ profile = false, mine = true, path, chef }) {
    if (mine === false) {
        chef = await get(path)
    }
    const image = await getImage()
    if (chef.error !== undefined || chef.result === undefined || chef.result.length === 0) {
        return null
    }

    const [rating, bestImages, category] = await Promise.all([
        get(`getChefRating/${chef.result[0]['CHEF_ID']}`),
        get(`bestFood/${chef.result[0]['CHEF_ID']}`),
        get(`bestFoodCategory/${chef.result[0]['CHEF_ID']}`)
    ])
    

    const blurImg = await getImage()
    const data = chef.result[0]

    const renderStars = (rating) => {
        const stars = []
        for (let i = 0; i < 5; i++) {
            if (i < Math.floor(rating)) {
                stars.push(<Star key={i} className="w-5 h-5 fill-primary text-primary" />)
            } else if (i === Math.floor(rating) && rating % 1 !== 0) {
                stars.push(<StarHalf key={i} className="w-5 h-5 fill-primary text-primary" />)
            } else {
                stars.push(<Star key={i} className="w-5 h-5 text-muted-foreground" />)
            }
        }
        return stars
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <Card className="overflow-hidden bg-gradient-to-br from-card to-background border-none shadow-xl">
                <CardContent className="p-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-8 space-y-6">
                            {!profile && (
                                <Badge variant="secondary" className="mb-4 bg-primary/10 text-primary">
                                    <ChefHat className="w-4 h-4 mr-2" />
                                    <span>Chef Profile</span>
                                </Badge>
                            )}
                            <CardTitle className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                {data['CHEF_NAME']}
                            </CardTitle>
                            <div className="flex items-center mb-4" aria-label={`Rating: ${rating.Rating.toFixed(1)} out of 5 stars`}>
                                {renderStars(rating.Rating)}
                                <span className="ml-2 text-sm text-muted-foreground">({rating.Rating.toFixed(1)})</span>
                            </div>
                            <p className="text-lg text-muted-foreground mb-6">{data['SPECIALITY']}</p>
                            <div className="flex flex-wrap gap-2 mb-6">
                                {category.result.map((cat, index) => (
                                    <Badge key={index} variant="outline" className="bg-secondary/20 text-secondary-foreground">
                                        {cat['NAME']}
                                    </Badge>
                                ))}
                            </div>
                            {!profile ? (
                                <Button asChild className="w-full sm:w-auto transition-all hover:shadow-md">
                                    <Link href={mine ? '/chef/my' : '#kitchen'}>
                                        <span>{mine ? 'Your Dashboard' : 'View Menu'}</span>
                                    </Link>
                                </Button>
                            ) : (
                                <div className="flex flex-wrap gap-4">
                                    <Button asChild className="w-full sm:w-auto transition-all hover:shadow-md">
                                        <Link href="/add_kitchen">
                                            <span>Add Kitchen</span>
                                        </Link>
                                    </Button>
                                    <Button asChild variant="outline" className="w-full sm:w-auto transition-all hover:shadow-md">
                                        <Link href="/chef/add_certificate">
                                            <span>Add Certificate</span>
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </div>
                        <div className="relative h-[400px] md:h-auto overflow-hidden rounded-b-lg md:rounded-r-lg md:rounded-bl-none">
                            {profile ? (
                                <Image
                                    src={data['PROFILE_IMAGE']}
                                    alt={`Profile picture of ${data['NAME']['FIRST_NAME']}`}
                                    layout="fill"
                                    objectFit="cover"
                                    placeholder="blur"
                                    blurDataURL={image}
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    quality={60}
                                    className="transition-transform duration-300 hover:scale-105"
                                />
                            ) : (
                                <div className="grid grid-cols-2 gap-2 h-full">
                                    {bestImages.result.slice(0, 4).map((image, index) => (
                                        <Link href={`/chef/kitchen/food/${image['ID']}`} key={index} className="relative h-full overflow-hidden rounded-lg group">
                                            <Image
                                                src={image['FOOD_IMAGE']}
                                                alt={`Chef's Dish ${index + 1}`}
                                                layout="fill"
                                                objectFit="cover"
                                                placeholder="blur"
                                                blurDataURL={blurImg}
                                                sizes="(max-width: 768px) 50vw, 25vw"
                                                quality={60}
                                                className="transition-transform duration-300 group-hover:scale-110"
                                            />
                                           
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {(chef !== undefined && chef.result[0]['KITCHEN_ID'] !== null && ((profile === false && chef.result[0]['APPROVED']) === 0) === false) && (
                <section className="mt-12 space-y-6" aria-labelledby="kitchens-heading">
                    <h2 id="kitchens-heading" className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {profile ? 'Your' : "Chef's"} Kitchens
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {chef.result.map((kitchen, index) => (
                            <Suspense key={index} fallback={<KitchenCardSkeleton />}>
                                <KitchenCard
                                    name={kitchen['KITCHEN_NAME']}
                                    image={kitchen['KITCHEN_IMAGE']}
                                    address={kitchen['KITCHEN_ADDRESS']}
                                    edit={kitchen['KITCHEN_ID']}
                                    profile={profile}
                                    approved={kitchen['APPROVED']}
                                />
                            </Suspense>
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}

const KitchenCardSkeleton = () => (
    <Card className="overflow-hidden">
        <CardContent className="p-0">
            <Skeleton className="h-48 rounded-t-lg" />
            <div className="p-4 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-1/2" />
            </div>
        </CardContent>
    </Card>
)

export default ChefProfile