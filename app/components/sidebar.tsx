import { UserButton } from "@stackframe/stack";
import { BarChart3,Package, Plus, Settings } from "lucide-react";
import { Barlow } from "next/font/google";
import Link from "next/link";

export default function Sidebar({path="/dashboard"}: {path: string}){
    const navigation = [
        {name: "Dashboard", href: "/dashboard", icon: BarChart3},
        {name: "Inventory", href: "/inventory", icon: Package},
        {name: "Add Product", href: "/add-product", icon: Plus},
        {name: "settings", href: "/settings", icon: Settings}
    ]
    return (
        <div className="fixed left-0 top-0 bg-gray-900 text-white w-64 min-h-screen p-6 z-10">
            <div className="mb-8">
                <div className="flex items-center space-x-2 mb-4">
                    <BarChart3 className='h-5 w-5' />
                    <span className="font-semibold text-lg">inventory app</span>
                </div>
            </div>
            <nav className="space-y-2">
                <div className="text-sm font-semibold text-gray-400 uppercase">inventory</div>
                {navigation.map((item, key)=>{
                    const IconComponent = item.icon
                    const isActive = path === item.href
                    return (
                        <Link href={item.href} key={key}            className={`flex space-x-3 py-3 px-2 rounded-lg ${isActive ? "bg-purple-500 text-gray-800" : " hover:bg-gray-800 text-gray-300"}`}>
                            <IconComponent className="w-5 h-5"/>
                           <span className="text-sm"> {item.name} </span>
                        </Link>
                        
                    )
                })}
                

            </nav>
            
            <div className="absolute bottom-0 left-0 right-0 borter-t  ">
                <div className="flex items-center justify-center">
                    <UserButton showUserInfo/>
                </div>
            </div>
            
        </div>
    )
}