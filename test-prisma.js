const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("🔍 Testing Prisma database connection...");

    // Test the connection
    await prisma.$connect();
    console.log("✅ Successfully connected to PostgreSQL database via Prisma");

    // Test User queries
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);

    // Test Cars queries
    const carCount = await prisma.cars.count();
    console.log(`🚗 Current car count: ${carCount}`);

    // Test relationships - Get users with their cars
    const usersWithCars = await prisma.user.findMany({
      include: {
        cars: true, // Include cars relationship (lowercase 'cars' as defined in schema)
      },
    });
    console.log(`� Users with cars:`);
    usersWithCars.forEach((user) => {
      console.log(`   - ${user.username}:`);
      if (user.cars.length === 0) {
        console.log("      No cars");
      } else {
        user.cars.forEach((car) => {
          console.log(`      - ${car.model} ($${car.price})`);
        });
      }
    });
    const admin = await prisma.user.findUnique({
      where: { username: "Admin" },
      include: {
        cars: true, // Include cars relationship (lowercase 'cars' as defined in schema)
      },
    });
    console.log(
      `👑 Admin user: ${admin.username} , ${admin.balance}, ${admin.cars[0].model} `
    );
    // Test relationships - Get cars with their owners
    const carsWithOwners = await prisma.cars.findMany({
      include: {
        owner: true, // Include owner relationship
      },
    });
    console.log(`🚗 Cars with owners:`);
    carsWithOwners.forEach((car) => {
      console.log(`   - ${car.model}: owned by ${car.owner.username}`);
    });

    console.log("🎉 Prisma is working correctly!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);

    if (error.code === "P1001") {
      console.log(
        "💡 Suggestion: Make sure PostgreSQL is running with: docker-compose up -d"
      );
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
