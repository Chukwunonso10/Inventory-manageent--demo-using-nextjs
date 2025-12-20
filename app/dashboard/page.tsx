import Sidebar from "../components/sidebar";
import { prisma }  from "@/app/utils/db"
import { getCurrentUser } from "@/app/lib/reuse"

export default async function Dashboard() {
    return (
        <div className="min-h-screen bg-gray-50 w-full">
            <Sidebar path="/dashboard" />
            <main className="ml-64 p-8">
                {/* header goes here */}
                <div className="mb-8"> 
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-semibold text-gray-900">
                            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                            <p className="text-gray-500 text-sm">welcome back! Here is an overview of your inventory</p>
                        </div>
                    </div>
                </div>

                {/* key metrics */}
               
            </main>
        </div>
    )
} 