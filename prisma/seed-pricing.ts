import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedPricing() {
  // Create default plans
  const plans = [
    {
      name: "Basic",
      subtitle: "Untuk yang baru memulai",
      price: 99000,
      period: "/undangan",
      features: [
        "1 Tema Undangan Online",
        "Link Custom (nama kamu)",
        "Tampilan Responsif",
        "Galeri Foto (5 foto)",
        "Support via Chat",
      ],
      isActive: true,
      isHighlight: false,
      isPopular: false,
      priority: 1,
      icon: "Star",
      gradient: "from-gray-100 to-gray-200",
      buttonStyle:
        "bg-gradient-to-r from-gray-700 to-gray-800 text-white hover:from-gray-600 hover:to-gray-700",
    },
    {
      name: "Premium",
      subtitle: "Paling Populer",
      price: 199000,
      period: "/undangan",
      features: [
        "2 Tema Undangan Online",
        "Custom Domain",
        "Musik & Galeri Unlimited",
        "Hitung Mundur Acara",
        "RSVP & Guest Book",
        "Amplop Digital",
        "Revisi 2x",
      ],
      isActive: true,
      isHighlight: true,
      isPopular: true,
      priority: 2,
      icon: "Crown",
      gradient: "from-amber-400 via-yellow-400 to-amber-500",
      buttonStyle: "bg-white text-amber-700 hover:bg-amber-50",
    },
    {
      name: "Exclusive",
      subtitle: "Untuk yang istimewa",
      price: 299000,
      period: "/undangan",
      features: [
        "Semua Fitur Premium",
        "Video Background HD",
        "Custom Design Tema",
        "Live Streaming Support",
        "Dukungan Prioritas 24/7",
        "Revisi Unlimited",
        "Free Domain 1 Tahun",
      ],
      isActive: true,
      isHighlight: false,
      isPopular: false,
      priority: 3,
      icon: "Sparkles",
      gradient: "from-purple-500 via-pink-500 to-purple-600",
      buttonStyle:
        "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500",
    },
  ];

  for (const plan of plans) {
    await prisma.pricingPlan.upsert({
      where: { id: plan.priority }, // or use name if unique
      update: {},
      create: plan,
    });
  }

  console.log("✅ Pricing plans seeded");
}

seedPricing()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
