'use server'
import { cookies } from 'next/headers';
import Link from 'next/link';

function NavBar(){
    return (
        <header className={` transition-all will-change-transform flex justify-between items-center mb-12 z-10 fixed bg-transparent backdrop-brightness-[0.6] backdrop-blur-lg bg-blend-darken w-full p-6`}>
            <Link href={"/"} className="text-2xl font-bold">Food-Daily</Link>
                {cookies().get('token') ? (
                    <div>
                        <Link href={"/profile"} className="transition-transform text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-full mr-2 hover:bg-[#181818]">Profile</Link>
                        <Link href={"/logout"} className="border-[0.5px] border-[#ffffff21] text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-md hover:bg-[#181818]">Logout</Link>
                    </div>
                 
                ) : (
                        <div>
                            <Link href={"/login"} className="transition-transform text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-full mr-2 hover:bg-[#181818]">Sign In</Link>
                            <Link href={"/signup"} className="border-[0.5px] border-[#ffffff21] text-[#d5d5d5ae] hover:text-white px-4 py-2 rounded-md hover:bg-[#181818]">Sign Up</Link>
                        </div>
                )}

        </header>
    )
}

export default NavBar