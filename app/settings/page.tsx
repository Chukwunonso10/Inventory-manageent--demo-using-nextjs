import { AccountSettings } from "@stackframe/stack";
import Sidebar from "../components/sidebar";
import { getCurrentUser } from "../lib/reuse";
import { redirect } from "next/navigation";


export default async function Settingspage() {
    const user = await getCurrentUser()
     if (!user) {
            redirect("/sign-In")
        }
        
    return (
         <div className="bg-gray-50 min-h-screen ">
                    <Sidebar path="/settings"/>
                    <main className="ml-64  p-8">
                        <div className="flex items-center justify-between">
                            <div className="mb-8">
                                <h1 className="text-2xl font-semibold text-gray-900 capitalize">Settings</h1>
                                <p className="text-sm capitalize text-gray-500">Manage your account settings and preferences</p>
                            </div>
                        </div>

                        <div className="max-w-6xl">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <AccountSettings fullPage />
                        </div>
                    </div>
                    </main>

                    
            </div>
    )
}