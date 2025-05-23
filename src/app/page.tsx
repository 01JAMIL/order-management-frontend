import DashboardStats from "@/components/DashboardStats";

export default function Dashboard() {

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>
            <DashboardStats/>
        </div>
    )
}
