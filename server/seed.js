const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // 1. Choose your credentials
  const email = "chidex6250@gmail.com";
  const password = "20042605"; // Change this to whatever you want
  const name = "System Administrator";

  // 2. Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // 3. Upsert the user (Creates if doesn't exist, updates if it does)
  const user = await prisma.user.upsert({
    where: { email: email },
    update: {},
    create: {
      email: email,
      password: hashedPassword,
      name: name,
      role: "ADMIN",
    },
  });

  console.log("-----------------------------------------");
  console.log("SEED SUCCESSFUL!");
  console.log(`User Created: ${user.name}`);
  console.log(`Email: ${user.email}`);
  console.log(`Password: ${password}`);
  console.log("-----------------------------------------");
}

main()
  .catch((e) => {
    console.error("Seed Error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
