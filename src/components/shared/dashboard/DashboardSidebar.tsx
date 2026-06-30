"use client"

import * as React from "react"
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
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { TeamSwitcher } from "@/components/team-switcher"
import { NavUser } from "@/components/nav-user"
import { iconMap } from "@/dummyData/adminNavData"

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

export interface NavGroup {
  label?: string
  items: NavItem[]
}

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

export function DashboardSidebar({
  navGroups,
  teams,
  user,
  ...props
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {teams && teams.length > 0 && <TeamSwitcher teams={teams} />}
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((group, idx) => (
          <SidebarGroup key={group.label || idx}>
            {group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
            <SidebarMenu>
              {group.items.map((item) => {
                const hasSubItems = item.items && item.items.length > 0
                const IconComponent = item.iconName ? iconMap[item.iconName] : null
                const renderedIcon = IconComponent ? (
                  <HugeiconsIcon icon={IconComponent} strokeWidth={2} />
                ) : (
                  item.icon
                )

                if (hasSubItems) {
                  return (
                    <Collapsible
                      key={item.title}
                      defaultOpen={item.isActive}
                      className="group/collapsible"
                      render={<SidebarMenuItem />}
                    >
                      <CollapsibleTrigger
                        render={<SidebarMenuButton tooltip={item.title} />}
                      >
                        {renderedIcon}
                        <span>{item.title}</span>
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          strokeWidth={2}
                          className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90"
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items?.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton render={<a href={subItem.url} />}>
                                <span>{subItem.title}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  )
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton tooltip={item.title} render={<a href={item.url} />}>
                      {renderedIcon}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}