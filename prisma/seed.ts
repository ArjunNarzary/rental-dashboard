import { PrismaClient } from "../src/generated/prisma"

const prisma = new PrismaClient()

async function main() {
  await prisma.listing.deleteMany()
  const sampleListings = Array.from({ length: 20 }, (_, i) => ({
    name: `Car ${i + 1}`,
    price: 100 + i * 10,
  }))

  await prisma.listing.createMany({
    data: sampleListings,
  })

  console.log("Seeding 20 listings")
}

main()
  .catch((e) => {
    console.log("Error seeding data: ", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
