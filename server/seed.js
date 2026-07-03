const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("20042605", 10);
  await prisma.user.upsert({
    where: { email: "chidex6250@gmail.com" },
    update: {},
    create: {
      email: "chidex6250@gmail.com",
      password: hashedPassword,
      name: "System Admin",
      role: "ADMIN",
    },
  });
  console.log(
    "Seed successful: User chidex6250@gmail.com created with password 20042605",
  );
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
