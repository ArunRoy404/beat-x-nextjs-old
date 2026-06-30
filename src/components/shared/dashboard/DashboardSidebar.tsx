"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavUser } from "@/components/nav-user"
import { iconMap } from "@/dummyData/adminNavData"
import { Logo } from "@/components/shared/logo/Logo"
import { cn } from "@/lib/utils"

/**
 * Interface representing a single navigation link item.
 */
export interface NavItem {
    title: string
    url: string
    icon?: React.ReactNode
    iconName?: string
    isActive?: boolean
    items?: {
        title: string
        url: string
    }[]
}

/**
 * Interface representing a group of navigation link items.
 */
export interface NavGroup {
    label?: string
    items: NavItem[]
}

/**
 * Main properties accepted by the reusable DashboardSidebar component.
 */
export interface DashboardSidebarProps extends React.ComponentProps<typeof Sidebar> {
    navGroups: NavGroup[]
    teams?: {
        name: string
        logo: React.ReactNode
        plan: string
    }[]
    user?: {
        name: string
        email: string
        avatar: string
    }
}

/**
 * DashboardSidebar is a reusable sidebar component styled using Tailwind.
 * It features collapsible structures, active path matching, custom headers with logos,
 * and handles background images gracefully.
 */
export function DashboardSidebar({
    navGroups,
    teams,
    user,
    ...props
}: DashboardSidebarProps) {
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"
    const pathname = usePathname()

    // Base classes applied to all items (both active and inactive)
    // Inactive hover background is configured to match the active background (hover:!bg-secondary/20)
    const itemBaseClass = "rounded-[8px] border-l-2 border-l-transparent transition-all duration-150 hover:!bg-secondary/20 hover:!text-secondary"

    // Specific classes only applied to active menu items
    const activeClass = "!border-l-secondary !bg-secondary/20 !text-secondary"

    return (
        <Sidebar
            collapsible="icon"
            style={{
                // Set the background image covering the whole sidebar
                backgroundImage: "url('/bg-images/sidebar_bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
            // Set inner wrapper transparent to let the container's background image shine through
            className="[&_[data-slot=sidebar-inner]]:bg-transparent text-white border-r border-[#004B56]"
            {...props}
        >
            {/* Sidebar Header Section - holds the full or single favicon logo and subtitles */}
            <SidebarHeader
                className={cn(
                    "flex flex-col items-center justify-center transition-all duration-200 border-b",
                    isCollapsed ? "p-2 py-4 border-b-transparent" : "px-4 py-6 gap-2 border-b-button-text"
                )}
            >
                {isCollapsed ? (
                    <Logo variant="single" />
                ) : (
                    <div className="flex flex-col items-center w-full gap-2">
                        <Logo variant="full" />
                        <span className="w-full text-center text-secondary font-['Space_Grotesk'] text-[16px] font-medium leading-normal not-italic truncate">
                            ADMIN CONTROL
                        </span>
                    </div>
                )}
            </SidebarHeader>

            {/* Sidebar Main Content Section - contains dynamic groups and links */}
            <SidebarContent>
                {navGroups.map((group, idx) => (
                    <SidebarGroup key={group.label || idx}>
                        {/* Render group header if label is present */}
                        {group.label && (
                            <SidebarGroupLabel className="text-white/60">
                                {group.label}
                            </SidebarGroupLabel>
                        )}

                        {/* Spacing between items inside the same navigation group configured as gap-1 */}
                        <SidebarMenu className="gap-1">
                            {group.items.map((item) => {
                                const hasSubItems = item.items && item.items.length > 0
                                const IconComponent = item.iconName ? iconMap[item.iconName] : null
                                const renderedIcon = IconComponent ? (
                                    <IconComponent className="w-5 h-5 shrink-0" width={20} height={20} />
                                ) : (
                                    item.icon
                                )

                                // Check if the current route is matching this parent item or any of its children
                                const isParentActive = pathname === item.url || (item.items && item.items.some(sub => pathname === sub.url))

                                // Render Collapsible Menu if item contains sub-items
                                if (hasSubItems) {
                                    return (
                                        <Collapsible
                                            key={item.title}
                                            defaultOpen={isParentActive}
                                            className="group/collapsible"
                                            render={<SidebarMenuItem />}
                                        >
                                            <CollapsibleTrigger
                                                render={
                                                    <SidebarMenuButton
                                                        tooltip={item.title}
                                                        isActive={isParentActive}
                                                        className={cn(
                                                            itemBaseClass,
                                                            pathname === item.url && activeClass
                                                        )}
                                                    />
                                                }
                                            >
                                                {renderedIcon}
                                                <span>{item.title}</span>
                                                {/* Dot indicator on the right side of the active navigation */}
                                                {!isCollapsed && pathname === item.url && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 ml-auto" />
                                                )}
                                                <HugeiconsIcon
                                                    icon={ArrowRight01Icon}
                                                    strokeWidth={2}
                                                    className={cn(
                                                        "transition-transform duration-200 group-data-open/collapsible:rotate-90",
                                                        pathname === item.url ? "ml-2" : "ml-auto"
                                                    )}
                                                />
                                            </CollapsibleTrigger>
                                            <CollapsibleContent>
                                                {/* Spacing between sub-items inside same menu configured as gap-1 */}
                                                <SidebarMenuSub className="gap-1">
                                                    {item.items?.map((subItem) => {
                                                        const isSubActive = pathname === subItem.url
                                                        return (
                                                            <SidebarMenuSubItem key={subItem.title}>
                                                                <SidebarMenuSubButton
                                                                    isActive={isSubActive}
                                                                    className={cn(
                                                                        itemBaseClass,
                                                                        isSubActive && activeClass
                                                                    )}
                                                                    render={<a href={subItem.url} />}
                                                                >
                                                                    <span>{subItem.title}</span>
                                                                    {/* Dot indicator on the right side of the active sub-navigation */}
                                                                    {!isCollapsed && isSubActive && (
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 ml-auto" />
                                                                    )}
                                                                </SidebarMenuSubButton>
                                                            </SidebarMenuSubItem>
                                                        )
                                                    })}
                                                </SidebarMenuSub>
                                            </CollapsibleContent>
                                        </Collapsible>
                                    )
                                }

                                // Render Single Navigation Link (no sub-items)
                                const isActive = pathname === item.url

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            tooltip={item.title}
                                            isActive={isActive}
                                            className={cn(
                                                itemBaseClass,
                                                isActive && activeClass
                                            )}
                                            render={<a href={item.url} />}
                                        >
                                            {renderedIcon}
                                            <span>{item.title}</span>
                                            {/* Dot indicator on the right side of the active navigation */}
                                            {!isCollapsed && isActive && (
                                                <span className="w-1.5 h-1.5 rounded-full bg-secondary shrink-0 ml-auto" />
                                            )}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {/* Sidebar Footer Section - Displays User Account metadata */}
            <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}