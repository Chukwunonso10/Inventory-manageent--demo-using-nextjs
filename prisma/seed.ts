// prisma/seed.ts
import { prisma } from "../app/utils/db"; // <-- your singleton client

async function seed() {
  try {
    const demoUser = "4129a629-50d9-4b03-a5f5-576adab1e049";

    // Seed 25 products
    await prisma.product.createMany( {
      data: Array.from({ length: 25 }).map((_, i) => ({
        userId: demoUser,
        name: `product ${i + 1}`,
        price: Number((Math.random() * 90 + 10).toFixed(2)), // Decimal must be number
        quantity: Math.ceil(Math.random() * 20),
        lowStockAt: 5,
      })),
    });

    console.log("✅ Seed data created successfully");
    console.log(`✅ Created 25 products for userId: ${demoUser}`);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect(); // Always disconnect
  }
}

// Run the seed
seed();
