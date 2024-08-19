'use server'
import { LogIn, LogOut, SearchCode, ShoppingCartIcon, Store, User } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

function NavBar(){
    return (
        <header className={`dark transition-all will-change-transform flex  justify-between items-center mb-12 z-30 fixed bg-transparent backdrop-brightness-[0.6] backdrop-blur-lg  w-full p-6`}>
            <Link href={"/"} className="text-2xl font-bold text-foreground">Food-Daily</Link>
            
                {cookies().get('token') ? (
                <div className='flex flex-wrap items-end'>
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