import Sidebar from "@/app/components/sidebar"
import { prisma } from "@/app/utils/db"
import { getCurrentUser } from "../lib/reuse"
import { revalidatePath } from "next/cache"
import deleteProducts from "../lib/serverActions/products"
import { Divide } from "lucide-react"
import Pagination from "../components/pagination"
import { redirect } from "next/navigation"
export default async function Inventory({ searchParams}: {searchParams: Promise<{query?: string, page?: string }>}) {

    const user = await getCurrentUser()
     if (!user) {
            redirect("/sign-In")
        }
    
    const userId = user?.id
    const searchParam = await searchParams
    const query = searchParam.query ?? ""
    console.log(query)
    
    const where = {
        ...(query ? {name: {contains: query.trim(), mode: "insensitive" as const }} : {})
    }

    // const totalProducts = await prisma.product.findMany({
    //     where: {
    //         name: {contains: query, mode: "insensitive"}
    //     }})


        const pageSize = 2 //my choice
        const page = Math.max(1, Number(searchParam.page ?? 1)) //defaults to 1 if negative

    const [totalCount, totalProducts] = await Promise.all([
        prisma.product.count({where: where}),
        prisma.product.findMany({
            where: where,
            orderBy: {createdAt: "desc"},
            skip: (page - 1 )* pageSize,
            take: pageSize,
        })
    ])

    
    
   const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))

   
    
    return (
        <div className="bg-gray-50 min-h-screen ">
            <Sidebar path="/inventory"/>
            <main className="ml-64  p-8">
                <div className="flex items-center justify-between">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900 capitalize">inventory</h1>
                        <p className="text-sm capitalize text-gray-500">Manage your products and track inventory levels</p>
                    </div>
                </div>

                <div className="space-y-2">
                    {/* search bar */}
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <form action="/inventory" method="GET" className="flex gap-2">
                            <input type="text" name="query"  className="rounded-lg px-4 py-2 border border-gray-300 flex-1 focus:border-transparent" placeholder="search products..." />
                            <button className="px-6 hover:cursor-pointer py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">search</button>
                        </form>
                    </div>

                    {/* products table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full"> 
                            <thead>
                                <tr>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 uppercase">Name</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 uppercase">Sku</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 uppercase">Price</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 uppercase">Quantity</th>
                                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-500 uppercase">Low Stock At</th>
                                    <th className="text-left px-6 py-4 text-sm text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {totalProducts.map((product, key)=>{
                                    return (
                                        <tr key={key}>
                                            <td className="text-left px-6 py-4 text-sm text-gray-500">{product.name}</td>
                                            <td className="text-left px-6 py-4 text-sm text-gray-500">{product.sku || "-"}</td>
                                            <td className="text-left px-6 py-4 text-sm text-gray-500">{(product.price).toFixed(2)}</td>
                                            <td className=" px-6 py-4 text-sm text-gray-500">{product.quantity}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{product.lowStockAt}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                <form action={async (formData: FormData)=>{
                                                    "use server"
                                                        await deleteProducts(formData)
                                                }}>
                                                    <input type="hidden" name="id" value={product.id} />
                                                    <button className="text-red-600 hover:text-red-900">Delete</button>
                                                </form>
                                            </td>
                                            
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>

                    </div>
                    { totalPages > 1 && <div className="bg-white rounded-lg border border-gray-200 p-6 ">
                        <Pagination currentPage={page} totalPages={totalPages} baseUrl="/inventory" searchParams={{query, pageSize: String(pageSize)}} />
                    </div> }
                </div>

            </main>
        </div>
        
    )
}