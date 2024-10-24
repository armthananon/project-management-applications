"use client";

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

import { SettingsIcon, UsersIcon } from 'lucide-react';
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go';

const routes = [
    {
        label: 'Home',
        href: '',
        icon: GoHome,
        activeIcon: GoHomeFill
    },
    {
        label: 'My Tasks',
        href: '/tasks',
        icon: GoCheckCircle,
        activeIcon: GoCheckCircleFill
    },
    {
        label: 'Settings',
        href: '/settings',
        icon: SettingsIcon,
        activeIcon: SettingsIcon
    },
    {
        label: 'Members',
        href: '/members',
        icon: UsersIcon,
        activeIcon: UsersIcon
    },
]

export const Navigation = () => {
    const workspaceId = useWorkspaceId();
    const pathname = usePathname();

    return (
        <ul className='flex flex-col'>
            {routes.map((route) => {
                const fullHref = `/workspaces/${workspaceId}${route.href}`
                const isActive = pathname === fullHref
                const Icon = isActive ? route.activeIcon : route.icon

                return (
                    <Link key={route.href} href={fullHref}>
                        <div className={cn(
                            "flex items-center gap-2.5 p-2.5 rounded-md font-medium hover:text-primary transition text-neutral-500",
                            isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
                        )}>
                            <Icon className='size-5 text-neutral-500' />
                            {route.label}
                        </div>
                    </Link>
                )
            })}
        </ul>
    )
}