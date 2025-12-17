import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTags() {
  const tags = [
    {
      name: "New",
      color: "from-emerald-500 to-teal-500",
      icon: "Sparkles",
    },
    {
      name: "Best Seller",
      color: "from-amber-500 to-yellow-500",
      icon: "TrendingUp",
    },
    {
      name: "Hot",
      color: "from-red-500 to-pink-500",
      icon: "Flame",
    },
    {
      name: "Popular",
      color: "from-purple-500 to-pink-500",
      icon: "Heart",
    },
    {
      name: "Premium",
      color: "from-blue-500 to-cyan-500",
      icon: "Crown",
    },
  ];

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { name: tag.name },
      update: {},
      create: tag,
    });
  }

  console.log("✅ Tags seeded successfully");
}

seedTags()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
