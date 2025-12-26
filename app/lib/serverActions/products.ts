"use server"
import { z } from "zod"
import { redirect } from "next/navigation"

import { prisma } from "@/app/utils/db"
import { getCurrentUser } from "../reuse"
import { revalidatePath } from "next/cache"

export default async function deleteProducts(formData: FormData) {
    const user = await getCurrentUser()
    const id = formData.get("id") as string || ""

    await prisma.product.deleteMany({
        where: {
            id: id
        }
    })
    revalidatePath("/inventory")

}

const productSchema = z.object({
    name: z.string().min(1, "Name is required"),
    price: z.coerce.number().nonnegative("price must be non-negative"),
    quantity: z.coerce.number().int().min(0, "quantity must be non-negative"),
    sku: z.string().optional(),
    lowStockAt: z.coerce.number().int().min(0).optional()
})

export  async function createProducts(formData: FormData) {
    const user = await getCurrentUser()
    if (!user) return

   const parsed = productSchema.safeParse({
    name: formData.get("name") as string,
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    sku: formData.get("sku") as string,
    lowStockAt: formData.get("lowStockAt") 
   })

   if (!parsed.success) {
    throw new Error("validation failed")
   }

   
    await prisma.product.create({
        data: {...parsed.data, userId:user?.id}
        
    })
    revalidatePath("/add-products")
    redirect("/inventory")
   
}