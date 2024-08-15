import { get_with_token } from '@/action';
import Link from 'next/link';
import Image from 'next/image'
import React from 'react'
import KitchenCard from './ui/KitchenCard';


async function ChefProfile({ profile = false, mine = true, path, chef }) {
    if (mine === false)
        chef = await get_with_token(path);
    
    if (chef.error !== undefined)
        return null
    const data = chef.result[0]
    const stars = []
    for (let i = 0; i < 5; i++) {
        if (i < data['RATING'])
            stars.push(<FullStar key={i} />)
        else if (i === data['RATING'] && data['RATING'] % 1 !== 0)
            stars.push(<HalfStar key={i}/>)
        else
            stars.push(<EmptyStar key={i}/>)
    }
    stars.push(<span className="ml-2" key={data['RATING']}>{data['RATING']}</span>)
    return (
        <div className=" m-auto grid place-content-center">

            <div className="bg-background text-foreground">
                <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="flex flex-col items-start justify-center">
                            <div className={`inline-block rounded-full bg-primary px-4 py-1 text-primary-foreground ${profile?'hidden':''}`}>Chef Profile</div>
                            <h1 className="mt-4 text-4xl font-bold tracking-tight">{data['FIRST_NAME']} {data['LAST_NAME']}</h1>
                            <span>
                                <p className="mt-4 text-lg text-muted-foreground flex flex-row">
                                    {stars}

                                </p>
                            </span>
                            <p className="mt-4 text-lg text-muted-foreground">
                                {data['SPECIALITY']}
                            </p>
                            <div className="mt-6 flex flex-wrap gap-4">
                                <div className="rounded-full bg-muted px-4 py-1 text-sm font-medium text-muted-foreground border border-[#ffffff16]">
                                    French Cuisine
                                </div>
                                <div className="rounded-full bg-muted px-4 py-1 text-sm font-medium text-muted-foreground border border-[#ffffff16]">
                                    Gourmet Dishes
                                </div>
                                <div className="rounded-full bg-muted px-4 py-1 text-sm font-medium text-muted-foreground border border-[#ffffff16]">Desserts</div>
                                <div className="rounded-full bg-muted px-4 py-1 text-sm font-medium text-muted-foreground border border-[#ffffff16]">
                                    Vegetarian Options
                                </div>
                            </div>
                            <div className={`${profile===true?'hidden':''}`}>
                                 <Link href={mine?'/chef/my':"/"} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-6">
                                    {mine?'Your Dashboard':'View Menu'}
                                </Link> 
                                
                            </div>
                            {profile && <div className="flex flex-wrap gap-5">
                                <Link href={"/add_kitchen"} className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-6  bg-[#0e1216]'>
                                    Add Kitchen
                                </Link>
                                <Link href={"/chef/add_certificate"} className='inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 mt-6  bg-[#0e1216]'>
                                    Add Certificate
                                </Link>
                            </div>}
                        </div>
                        {profile ? <div className='m-auto'>

                            <Image quality={60} src={data['PROFILE_IMAGE']} width="400" height="400" alt={data['FIRST_NAME']} className="rounded-lg object-cover" />
                        </div>:
                        <div className={`grid grid-cols-2 gap-4`}>
                                <Image quality={60}
                                src="/vercel.svg"
                                width="300"
                                height="300"
                                alt="Chef's Dish 1"
                                className="rounded-lg object-cover"

                            />
                            <Image 
                                src="/vercel.svg"
                                width="300"
                                height="300"
                                alt="Chef's Dish 2"
                                className="rounded-lg object-cover"

                            />
                            <Image
                                src="/vercel.svg"
                                width="300"
                                height="300"
                                alt="Chef's Dish 3"
                                className="rounded-lg object-cover"

                            />
                            <Image
                                src="/vercel.svg"
                                width="300"
                                height="300"
                                alt="Chef's Dish 4"
                                className="rounded-lg object-cover"

                            />
                        </div>
                        }
                        
                        
                    </div>
                </div>
            </div>
            <div className='m-5 dark:text-white'>
                <h1 className={`text-2xl font-medium mb-3 ${(chef !== undefined && chef.result[0]['KITCHEN_ID'] !== null && ((profile === false && chef.result[0]['APPROVED']) === 0) === false) ?'':'hidden'}`}>Your Kitchens</h1>
                {(chef !== undefined && chef.result[0]['KITCHEN_ID'] !== null  && ((profile===false && chef.result[0]['APPROVED'])===0)===false) && <div className='w-full flex flex-wrap gap-6'>
                    {
                        chef.result.map((kitchen,index) => { 
                        return (
                            <KitchenCard key={index} name={kitchen['KITCHEN_NAME']} image={kitchen['KITCHEN_IMAGE']} address={kitchen['KITCHEN_ADDRESS']} edit={kitchen['KITCHEN_ID']} profile={profile} approved={kitchen['APPROVED']} />


                        );
                    })}
                </div>}
            </div>
        </div>

    )
}

export default ChefProfile

const FullStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
    </svg>
);

const HalfStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M12 5.173V18.354l4.627 2.826c.996.608 2.231-.29 1.96-1.425l-1.257-5.273 4.117-3.527c.887-.76.415-2.212-.749-2.305l-5.404-.433-2.082-5.006c-.448-1.077-1.976-1.077-2.424 0L10.788 3.21l-5.404.433c-1.164.093-1.636 1.545-.749 2.305l4.117 3.527-1.257 5.273c-.271 1.136.964 2.033 1.96 1.425L12 18.354V5.173z" clipRule="evenodd" fill="white" />
    </svg>
);

const EmptyStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-300">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
);