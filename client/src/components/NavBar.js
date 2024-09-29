'use server'
import { get, get_with_token } from '@/action'
import { ChefHat, Lock, LogIn, LogOut, ShieldCheck, ShoppingCart, Store, Truck, User } from 'lucide-react'
import { cookies } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { Button3 } from '@/components/ui/button3'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { ModeToggle } from './ThemeSwtich'

async function NavBar() {
    const [delivery, chef, qa, admin, cart] = await Promise.all([
        get_with_token('jwt/isDelivery'),
        get_with_token('jwt/isChef'),
        get_with_token('jwt/isQa'),
        get_with_token('jwt/isAdmin'),
        get_with_token('jwt/getCart')
    ])
    const total = cart.error?0: cart.result.reduce((acc, item) => acc + item['QUANTITY'], 0)

    const roleLinks = [
        { condition: admin.status, href: "/admin", icon: Lock, key: 1, tooltip: "Admin Dashboard" },
        { condition: delivery.status, href: "/delivery", icon: Truck, key: 2, tooltip: "Delivery Management" },
        { condition: chef.status, href: "/chef/my", icon: ChefHat, key: 3, tooltip: "Chef Portal" },
        { condition: qa.status, href: "/qa_dashboard/qa", icon: ShieldCheck, key: 4, tooltip: "QA Dashboard" },
    ].filter(link => link.condition)

    const isLoggedIn = cookies().get('token')

    return (
        <TooltipProvider>
            <header className="backdrop-blur-sm bg-transparent transition-all will-change-transform flex justify-between items-center z-30 fixed w-full p-4 md:p-6 ">
                <Link href="/" className="flex items-center space-x-2 group">
                    <div className="relative">
                        <Image src="/logo.jpg" alt="logo" width={50} height={50} className="rounded-full h-10 w-10 md:h-12 md:w-12 transition-transform group-hover:scale-110" />
                        <div className="absolute inset-0 rounded-full bg-primary/20 transform scale-110 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-xl md:text-2xl font-bold text-foreground hidden sm:inline-block group-hover:text-primary transition-colors">Food-Daily</span>
                </Link>

                <nav className="flex items-center space-x-1 md:space-x-2">
                    {isLoggedIn ? (
                        <>
                            <div className="flex space-x-1 md:space-x-2">
                                {roleLinks.map(({ href, icon: Icon, key, tooltip }) => (
                                    <Tooltip key={key}>
                                        <TooltipTrigger asChild>
                                            <Button3 variant="ghost" size="icon" asChild className="relative group">
                                                <Link href={href} className="transition-colors hover:text-primary p-2">
                                                    <Icon className="h-5 w-5" />
                                                    <span className="sr-only">{tooltip}</span>
                                                    <span className="absolute inset-0 rounded-md bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                                </Link>
                                            </Button3>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{tooltip}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                ))}
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button3 variant="ghost" size="icon" asChild className="relative group">
                                        <Link href="/search" className="transition-colors hover:text-primary p-2">
                                            <Store className="h-5 w-5" />
                                            <span className="sr-only">Search Store</span>
                                            <span className="absolute inset-0 rounded-md bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        </Link>
                                    </Button3>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Search Store</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button3 variant="ghost" size="icon" asChild className="relative group">
                                        <Link href="/cart" className="transition-colors hover:text-primary p-2">
                                            <ShoppingCart className="h-5 w-5" />
                                            <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-[10px]">{total}</Badge>
                                            <span className="sr-only">Food Cart</span>
                                            <span className="absolute inset-0 rounded-md bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        </Link>
                                    </Button3>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Food Cart</p>
                                </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button3 variant="ghost" size="icon" asChild className="relative group">
                                        <Link href="/profile" className="transition-colors hover:text-primary p-2">
                                            <User className="h-5 w-5" />
                                            <span className="sr-only">User Profile</span>
                                            <span className="absolute inset-0 rounded-md bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        </Link>
                                    </Button3>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>User Profile</p>
                                </TooltipContent>
                            </Tooltip>
                            <ModeToggle />
                            <Button3 variant="outline" size="sm" asChild className="hidden sm:inline-flex group relative overflow-hidden">
                                <Link href="/logout" className="transition-colors">
                                    <span className="relative z-10">Log Out</span>
                                    <span className="absolute inset-0 bg-primary/20 transform -translate-x-full group-hover:translate-x-0 transition-transform"></span>
                                </Link>
                            </Button3>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button3 variant="ghost" size="icon" asChild className="sm:hidden relative group">
                                        <Link href="/logout" className="transition-colors hover:text-primary p-2">
                                            <LogOut className="h-5 w-5" />
                                            <span className="sr-only">Log Out</span>
                                            <span className="absolute inset-0 rounded-md bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        </Link>
                                    </Button3>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Log Out</p>
                                </TooltipContent>
                            </Tooltip>
                        </>
                    ) : (
                        <>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button3 variant="ghost" size="icon" asChild className="relative group">
                                        <Link href="/search" className="transition-colors hover:text-primary p-2">
                                            <Store className="h-5 w-5" />
                                            <span className="sr-only">Search Store</span>
                                            <span className="absolute inset-0 rounded-md bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        </Link>
                                    </Button3>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Search Store</p>
                                </TooltipContent>
                            </Tooltip>
                            <ModeToggle />
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button3 variant="ghost" size="icon" asChild className="sm:hidden relative group">
                                        <Link href="/login" className="transition-colors hover:text-primary p-2">
                                            <LogIn className="h-5 w-5" />
                                            <span className="sr-only">Log In</span>
                                            <span className="absolute inset-0 rounded-md bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                                        </Link>
                                    </Button3>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Log In</p>
                                </TooltipContent>
                            </Tooltip>
                            <Button3 variant="outline" size="sm" asChild className="hidden sm:inline-flex group relative overflow-hidden">
                                <Link href="/login" className="transition-colors">
                                    <span className="relative z-10">Log In</span>
                                    <span className="absolute inset-0 bg-primary/20 transform -translate-x-full group-hover:translate-x-0 transition-transform"></span>
                                </Link>
                            </Button3>
                            <Button3 variant="default" size="sm" asChild className="group relative overflow-hidden">
                                <Link href="/signup" className="transition-colors">
                                    <span className="relative z-10">Sign Up</span>
                                    <span className="absolute inset-0 bg-primary/20 transform -translate-x-full group-hover:translate-x-0 transition-transform"></span>
                                </Link>
                            </Button3>
                        </>
                    )}
                </nav>
            </header>
        </TooltipProvider>
    )
}

export default NavBar