"use client"

import { DashboardNavbar } from "@/components/shared/dashboard/DashboardNavbar"
import DashboardOutlet from "@/components/shared/dashboard/DashboardOutlet"
import { DashboardSidebar } from "@/components/shared/dashboard/DashboardSidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useAdminNavStore } from "@/store/useAdminNavStore"

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const navGroups = useAdminNavStore((state) => state.navGroups)

    return (
        <SidebarProvider
            style={{
                backgroundImage: "url('/bg-images/dashboard_bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
            className="min-h-screen w-full bg-background"
        >
            <DashboardSidebar navGroups={navGroups} />
            <SidebarInset className="max-h-screen h-screen overflow-hidden flex flex-col bg-transparent!">
                <DashboardNavbar />
                <DashboardOutlet>
                    {children}
                </DashboardOutlet>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AdminDashboardLayout;