'use server'
import { get_with_token } from '@/action';
import { ChefHat, Lock, LogIn, LogOut, SearchCode, ShieldCheck, ShoppingCartIcon, Store, Truck, User } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function NavBar() {
    let status = []
    const [delivery, chef, qa, admin] = await Promise.all([get_with_token('jwt/isDelivery'), get_with_token('jwt/isChef'), get_with_token('jwt/isQa'), get_with_token('jwt/isAdmin')]);
    if (admin.status)
    {
        status.push(<Link href={"/admin"} key={1} className="transition-transform text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-full mr-2 "><Lock/></Link>)
    }
    if (delivery.status)
    {
        status.push(<Link href={"/delivery"} key={2} className="transition-transform text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-full mr-2 "><Truck/></Link>)
    }

    if (chef.status)
    {
        status.push(<Link href={"/chef/my"} key={3} className="transition-transform text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-full mr-2 "><ChefHat/></Link>)
    }

    if (qa.status)
    {
        status.push(<Link href={"/admin/qa"} key={4} className="transition-transform text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-full mr-2 "><ShieldCheck/></Link>)
    }



    return (
        <header className={`dark transition-all will-change-transform flex  justify-between items-center mb-12 z-30 fixed bg-transparent backdrop-brightness-[0.6] backdrop-blur-lg  w-full p-6`}>
            <Link href={"/"} className="text-2xl font-bold text-foreground">Food-Daily</Link>
            
                {cookies().get('token') ? (
                <div className='flex flex-wrap items-end'>
                    {status}
                    <Link href={"/search"} className="transition-transform text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-full mr-2 "><Store/></Link>
                    <Link href={"/cart"} className="transition-transform text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-full mr-2 "><ShoppingCartIcon/></Link>
                        <Link href={"/profile"} className="transition-transform text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-full mr-2 "><User/></Link>
                        <Link href={"/logout"} className="border-[0.5px] border-[#ffffff21] text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-md hover:bg-[#181818]">Log Out</Link>
                    </div>
                 
                ) : (
                    <div className='flex flex-wrap'>
                        <Link href={"/search"} className="transition-transform text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-full mr-2 "><Store/></Link>
                            <Link href={"/login"} className="transition-transform text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-full mr-2 "><LogIn/></Link>
                            <Link href={"/signup"} className="border-[0.5px] border-[#ffffff21] text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-md hover:bg-[#181818]">Sign Up</Link>
                        </div>
                )}

        </header>
    )
}

export default NavBar