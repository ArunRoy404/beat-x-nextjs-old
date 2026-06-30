"use client"

import { DashboardNavbar } from "@/components/shared/dashboard/DashboardNavbar"
import { DashboardSidebar } from "@/components/shared/dashboard/DashboardSidebar"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { useAdminNavStore } from "@/store/useAdminNavStore"

const AdminDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const navGroups = useAdminNavStore((state) => state.navGroups)

    return (
        <SidebarProvider>
            <DashboardSidebar navGroups={navGroups} />
            <SidebarInset>
                <DashboardNavbar />
                <main className="flex flex-1 flex-col gap-6 py-8 px-6">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}

export default AdminDashboardLayout;