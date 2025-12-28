import Sidebar from "../components/sidebar";
import { prisma } from "@/app/utils/db"
import { getCurrentUser } from "@/app/lib/reuse"
import { redirect } from "next/navigation";
import { TrendingDown, TrendingUp, TrendingUpIcon } from "lucide-react";
import ProductChart from "../components/productchart";

export default async function Dashboard() {
    const user = await getCurrentUser()
    if (!user) {
        redirect("/sign-In")
    }
    const userId = user.id
    const [totalProducts, recentProducts, allProducts, lowStockAt] = await Promise.all([
        prisma.product.count(),
        prisma.product.findMany({
            orderBy: { createdAt: "desc" },
            take: 5
        }),
        prisma.product.findMany({
            select: { price: true, quantity: true, createdAt: true }
        }),
        prisma.product.count({
            where: {
                lowStockAt: { not: null },
                quantity: { lte: 5 }
            }
        })

    ])

    const inStockCount = allProducts.filter((stock, _) => stock.quantity > 5).length
    const lowStockCount = allProducts.filter((stock, _) => stock.quantity <= 5 && stock.quantity >= 1).length
    const outOfStockCount = allProducts.filter((stock, i) => stock.quantity == 0).length

    const inStockCountPercentage = inStockCount > 0 ? (Math.round((inStockCount / totalProducts) * 100)) : 0
    const lowStockCountPercentage = lowStockCount > 0 ? (Math.round((lowStockCount / totalProducts) * 100)) : 0
    const outOfStockCountPercentage = outOfStockCount > 0 ? (Math.round((outOfStockCount / totalProducts) * 100)) : 0

    const now = new Date()
    const weeklyProductData = []

    for (let i = 11; i >= 0; i--) {
        const weekStart = new Date(now)
        weekStart.setDate(weekStart.getDate() - i * 7)
        weekStart.setHours(0, 0, 0, 0)

        const weekEnds = new Date(weekStart)
        weekEnds.setDate(weekEnds.getDate() + 6)
        weekEnds.setHours(23, 59, 59, 999)

        const weeklabel = `${String(weekStart.getMonth() + 1).padStart(2, "0")} / ${String(weekStart.getDate()).padStart(2, "0")}`

        const weekProduct = allProducts.filter((product, index) => {
            const productDate = new Date(product.createdAt)
            return productDate >= weekStart && productDate <= weekEnds;
        })

        weeklyProductData.push({
            week: weeklabel,
            product: weekProduct.length
        })
    }


    const totalValue = allProducts.reduce((sum, product) => sum + Number(product.price) * Number(product.quantity), 0)
    console.log(allProducts)
    return (
        <div className="min-h-screen bg-gray-50 w-full">
            <Sidebar path="/dashboard" />
            <main className="ml-64 p-8">
                {/* header goes here */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div className="text-2xl font-semibold text-gray-900">
                            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                            <p className="text-gray-500 text-sm">welcome back! Here is an overview of your inventory { }</p>
                        </div>
                    </div>
                </div>

                {/* key metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6 text-gray-500">
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <h2 className="font-semibold  text-gray-900 mb-6 text-lg"> key metrics</h2>
                        <div className="grid grid-cols-3 gap-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">{totalProducts}</div>
                                <div className="text-sm text-gray-600">totalProducts</div>
                                <div className="flex  items-center justify-center mt-1">
                                    <span className="text-xs text-green-600">+{totalProducts}</span>
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                            </div>



                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">{(totalValue).toFixed(0)}</div>
                                <div className="text-sm text-gray-600">total Value</div>
                                <div className="flex  items-center justify-center mt-1">
                                    <span className="text-xs text-green-600">+{totalProducts}</span>
                                    <TrendingDown className="h-5 w-5 text-green-600" />
                                </div>
                            </div>


                            <div className="text-center">
                                <div className="text-3xl font-bold text-gray-900">{lowStockAt}</div>
                                <div className="text-sm text-gray-600">low stock</div>
                                <div className="flex  items-center justify-center mt-1">
                                    <span className="text-xs text-green-600">+{lowStockAt}</span>
                                    <TrendingUpIcon className="h-5 w-5 text-green-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* inventory over time  */}
                    <div className="bg-white rounded-lg border border-gray-200  p-6 ">
                        <div className="mb-6">
                            <h1 className="uppercase font-semibold">New product per week</h1>
                            <div className="h-48 w-full">
                                <ProductChart data={weeklyProductData} />
                            </div>

                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1  lg:grid-cols-2 gap-8 mb-8">
                    {/* stock levels */}
                    <div className="bg-white rounded border border-gray-50 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">stock levels</h2>
                        </div>
                        <div className="space-y-3">
                            {recentProducts.map((recent, i) => {
                                const stockLevel = recent.quantity == 0 ? 0 : recent.quantity <= (recent.lowStockAt || 5) ? 1 : 2

                                const bgColors = ["bg-red-600", "bg-yellow-600", "bg-green-600"]
                                const textColors = ["text-red-600", "text-yellow-600", "text-green-600"]

                                return (
                                    <div key={i} className="flex gap-6 justify-between p-3 rounded-lg bg-gray-50">
                                        <div className="flex items-center justify-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${bgColors[stockLevel]}`} />
                                            <span className="">{recent.name}</span>
                                        </div>
                                        <div className={`text-sm font-medium text-gray-900${textColors[stockLevel]} `}>{recent.quantity} units</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Efficiency */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <h1 className="font-semibold text-900 text-gray-900">Efficiency</h1>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="relative w-48 h-48">
                                <div className="absolute inset-0 rounded-full border-8 border-gray-200"></div>
                                <div className="absolute inset-0 rounded-full border-8 border-purple-600 " style={{ clipPath: "polygon(50% 50% 0% 100% 0% 100% 100% 0% 100% 0% 50%)" }}></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl  font-bold text-gray-900">{inStockCountPercentage}%</div>
                                        <div className="text-sm text-gray-600">In Stock</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 space-y-2">
                            <div className="text-sm text-gray-600 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="h-3 w-3 rounded-full bg-purple-200"> </div>
                                    <span>instock ({inStockCountPercentage}%)</span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="h-3 w-3 rounded-full bg-purple-200"> </div>
                                    <span>instock ({lowStockCountPercentage}%)</span>
                                </div>
                            </div>
                            <div className="text-sm text-gray-600 flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <div className="h-3 w-3 rounded-full bg-purple-200"> </div>
                                    <span>instock ({outOfStockCountPercentage}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    )
} 