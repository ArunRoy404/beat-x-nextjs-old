const DashboardOutlet = ({ children }: { children: React.ReactNode }) => {
    return (
        <main className="flex flex-1 flex-col gap-6 py-8 px-6 overflow-y-auto">
            {children}
        </main>
    )
}

export default DashboardOutlet 