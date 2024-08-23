'use client'
import React from 'react'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button3 } from '@/components/ui/button3'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import {
    HomeIcon,
    LayoutDashboardIcon,
    ClockIcon,
    TrendingUpIcon,
    ActivityIcon,
    SettingsIcon,
    FileTextIcon,
    CheckCircleIcon,
    UserCogIcon,
    ScanSearch,
} from 'lucide-react'

const navItems = [
    { icon: HomeIcon, label: 'Home', href: '/' },
    { icon: LayoutDashboardIcon, label: 'Overview', href: '/admin' },
    { icon: ClockIcon, label: 'Recent', href: '/admin/recent' },
    { icon: SettingsIcon, label: 'Manage', href: '/admin/manage' },
    { icon: FileTextIcon, label: 'Reports', href: '/admin/reports' },
    { icon: CheckCircleIcon, label: 'Approved', href: '/admin/approve' },
    { icon: ScanSearch, label: 'Advance Query', href: '/admin/advanced' },
]

export default function AdminNavbar() {
    const pathname = usePathname()

    return (
        <div>
            <TooltipProvider>
                <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
                    <div className="bg-background/80 backdrop-blur-sm border rounded-full p-2 shadow-lg">
                        <ul className="flex items-center justify-center space-x-2">
                            {navItems.map((item) => (
                                <li key={item.label}>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button3
                                                asChild
                                                variant="ghost"
                                                size="icon"
                                                className={cn(
                                                    "rounded-full",
                                                    pathname === item.href && "bg-primary text-primary-foreground"
                                                )}
                                            >
                                                <Link href={item.href}>
                                                    <item.icon className="h-5 w-5" />
                                                    <span className="sr-only">{item.label}</span>
                                                </Link>
                                            </Button3>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{item.label}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>
            </TooltipProvider>
        </div>
        
    )
}