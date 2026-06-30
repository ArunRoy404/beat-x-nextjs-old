"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, Notification01Icon } from "@hugeicons/core-free-icons"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

export interface DashboardNavbarProps extends React.HTMLAttributes<HTMLElement> {
    title?: string
    subtitle?: string
    notificationCount?: number
    user?: {
        name?: string
        email?: string
        avatar?: string
    }
    onSearchClick?: () => void
    onNotificationsClick?: () => void
}

/**
 * DashboardNavbar is a responsive navigation bar styled using Tailwind.
 * It features a cover background image, Space Grotesk typography for the title,
 * glassmorphic action buttons for search and notifications, and an avatar.
 * Strictly avoids hardcoded colors by utilizing variables defined in globals.css.
 */
export function DashboardNavbar({
    title = "Music Management",
    subtitle = "Manage all platform music — upload, review, approve",
    notificationCount = 3,
    user = {
        name: "User Name",
        avatar: "/images/avatar-placeholder.png",
    },
    onSearchClick,
    onNotificationsClick,
    className,
    ...props
}: DashboardNavbarProps) {
    return (
        <header
            style={{
                backgroundImage: "url('/bg-images/navigation_bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
            className={cn(
                "w-full flex items-center justify-between px-4 py-4 md:px-8 md:py-5 text-white gap-4",
                className
            )}
            {...props}
        >
            {/* Left side: Sidebar Trigger, Title and Subtitle */}
            <div className="flex items-center gap-3 md:gap-4 min-w-0">
                <SidebarTrigger className="text-white bg-search-btn-bg border border-button-text hover:bg-secondary/20 hover:text-secondary rounded-[8px] h-9 w-9 shrink-0 cursor-pointer" />
                <div className="flex flex-col min-w-0">
                    <h1
                        style={{
                            fontFamily: '"Space Grotesk", sans-serif',
                            lineHeight: "normal",
                        }}
                        className="text-white font-medium truncate text-lg sm:text-2xl"
                    >
                        {title}
                    </h1>
                    {/* Subtitle is hidden on smaller screens to prevent layout crampedness */}
                    <p className="text-white/60 text-xs md:text-sm mt-1 hidden sm:block truncate leading-normal">
                        {subtitle}
                    </p>
                </div>
            </div>

            {/* Right side: Actions (Search, Notification, Avatar) */}
            <div className="flex items-center gap-3 md:gap-4 shrink-0">
                {/* Search Action Button */}
                <button
                    onClick={onSearchClick}
                    aria-label="Search"
                    className="flex items-center justify-center bg-search-btn-bg backdrop-blur-md border border-button-text hover:bg-secondary/20 hover:text-secondary rounded-[12px] p-2 md:p-3 transition-all duration-150 cursor-pointer"
                >
                    <HugeiconsIcon icon={Search01Icon} className="w-5 h-5" strokeWidth={2} />
                </button>

                {/* Notifications Action Button with Badge */}
                <button
                    onClick={onNotificationsClick}
                    aria-label="Notifications"
                    className="relative flex items-center justify-center bg-search-btn-bg backdrop-blur-md border border-button-text hover:bg-secondary/20 hover:text-secondary rounded-[12px] p-2 md:p-3 transition-all duration-150 cursor-pointer"
                >
                    <HugeiconsIcon icon={Notification01Icon} className="w-5 h-5 text-secondary" strokeWidth={2} />
                    {notificationCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-error text-[10px] font-bold text-white leading-none">
                            {notificationCount}
                        </span>
                    )}
                </button>

                {/* User Profile Avatar */}
                <Avatar className="w-10 h-10 border border-button-text">
                    <AvatarImage src={user.avatar} alt={user.name || "Profile"} />
                    <AvatarFallback className="bg-search-bg/80 text-white font-medium text-sm">
                        {user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                    </AvatarFallback>
                </Avatar>
            </div>
        </header>
    )
}