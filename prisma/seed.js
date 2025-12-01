import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../dist/util/auth.js";
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Clear existing data (optional - comment out if you want to keep existing data)
  console.log("🧹 Cleaning existing data...");
  // Delete cars first (due to foreign key constraint)
  try {
    await prisma.cars.deleteMany();
    console.log("✅ Existing cars deleted");
  } catch (e) {
    // Cars table might not exist yet - that's okay
    console.log("ℹ️  No cars to delete (table may not exist yet)");
  }
  // Delete posts second (if they exist)
  try {
    await prisma.post.deleteMany();
    console.log("✅ Existing posts deleted");
  } catch (e) {
    // Posts table might not exist yet - that's okay
    console.log("ℹ️  No posts to delete (table may not exist yet)");
  }
  await prisma.user.deleteMany();
  console.log("✅ Existing users deleted");

  // Create sample users
  console.log("👥 Creating sample users...");

  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "Admin",
        role: "admin",
        password: await hashPassword("admin123"),
      },
    }),
    prisma.user.create({
      data: {
        username: "Alice Johnson",
        password: await hashPassword("alice123"),
      },
    }),
    prisma.user.create({
      data: {
        username: "Bob Smith",
        password: await hashPassword("bob123"),
      },
    }),
    prisma.user.create({
      data: {
        username: "Charlie Brown",
        password: await hashPassword("charlie123"),
      },
    }),
  ]);
  const cars = await Promise.all([
    prisma.cars.create({
      data: {
        model: "Toyota Camry",
        price: 100,
        ownerId: users[0].id, // Use ownerId instead of owner object
      },
    }),
    prisma.cars.create({
      data: {
        model: "Honda Civic",
        price: 20,
        ownerId: users[1].id,
      },
    }),
    prisma.cars.create({
      data: {
        model: "BMW 3 Series",
        price: 300,
        ownerId: users[2].id,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users:`);
  users.forEach((user) => {
    console.log(`   - ${user.username}`);
  });

  console.log(`✅ Created ${cars.length} cars:`);
  cars.forEach((car) => {
    console.log(`   - ${car.model} ($${car.price})`);
  });

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
