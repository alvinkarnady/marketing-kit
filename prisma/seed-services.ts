import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // ========================================
  // SERVICE SETTINGS
  // ========================================
  console.log("📋 Seeding Service Settings...");

  const serviceSettings = await prisma.serviceSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      maxDisplay: 3,
      enableFlipAnimation: true,
      autoRotate: false,
      autoRotateInterval: 5000,
    },
  });

  console.log("✅ Service Settings created:", serviceSettings);

  // ========================================
  // SERVICES
  // ========================================
  console.log("🎨 Seeding Services...");

  const services = await Promise.all([
    // Service 1: Classic Elegance
    prisma.service.upsert({
      where: { id: 1 },
      update: {},
      create: {
        title: "Classic Elegance",
        description:
          "Gaya timeless dengan sentuhan emas dan nuansa ivory, sempurna untuk pernikahan elegan dan romantis. Desain klasik yang tak lekang oleh waktu.",
        icon: "Crown",
        image: "/images/service-classic.jpg",
        color: "from-amber-400 to-yellow-500",
        features: [
          "Desain timeless & elegan",
          "Animasi smooth & halus",
          "Musik romantis bawaan",
          "Warna emas & ivory",
          "Template responsif",
        ],
        buttonText: "Lihat Tema Ini",
        buttonLink: "#themes",
        isActive: true,
        isFeatured: true,
        priority: 1,
      },
    }),

    // Service 2: Modern Minimalist
    prisma.service.upsert({
      where: { id: 2 },
      update: {},
      create: {
        title: "Modern Minimalist",
        description:
          "Desain clean, tipografi tegas, dan animasi halus. Cocok untuk pasangan modern yang menyukai kesederhanaan berkelas dengan sentuhan kontemporer.",
        icon: "Sparkles",
        image: "/images/service-modern.jpg",
        color: "from-indigo-400 to-purple-500",
        features: [
          "Desain minimalis & clean",
          "Loading super cepat",
          "UI/UX modern",
          "Tipografi premium",
          "Mobile-first design",
        ],
        buttonText: "Lihat Tema Ini",
        buttonLink: "#themes",
        isActive: true,
        isFeatured: false,
        priority: 2,
      },
    }),

    // Service 3: Luxury Bloom
    prisma.service.upsert({
      where: { id: 3 },
      update: {},
      create: {
        title: "Luxury Bloom",
        description:
          "Motif floral lembut dengan tone champagne dan rose gold. Memberikan nuansa hangat dan berkelas dengan sentuhan bunga yang memukau.",
        icon: "Flower2",
        image: "/images/service-luxury.jpg",
        color: "from-pink-400 to-rose-500",
        features: [
          "Floral pattern premium",
          "Warna lembut & hangat",
          "Detail eksklusif",
          "Rose gold accent",
          "Animasi petal effect",
        ],
        buttonText: "Lihat Tema Ini",
        buttonLink: "#themes",
        isActive: true,
        isFeatured: false,
        priority: 3,
      },
    }),

    // Service 4: Royal Garden
    prisma.service.upsert({
      where: { id: 4 },
      update: {},
      create: {
        title: "Royal Garden",
        description:
          "Tema garden party dengan kombinasi hijau alami dan aksen gold. Sempurna untuk pernikahan outdoor atau konsep botanical.",
        icon: "Award",
        image: null, // Placeholder - akan gunakan icon
        color: "from-green-400 to-emerald-500",
        features: [
          "Garden theme natural",
          "Botanical illustrations",
          "Green & gold palette",
          "Outdoor wedding ready",
          "Nature-inspired design",
        ],
        buttonText: "Lihat Tema Ini",
        buttonLink: "#themes",
        isActive: true,
        isFeatured: false,
        priority: 4,
      },
    }),

    // Service 5: Romantic Sunset
    prisma.service.upsert({
      where: { id: 5 },
      update: {},
      create: {
        title: "Romantic Sunset",
        description:
          "Gradasi warna sunset dengan nuansa romantis dan warm tone. Menciptakan suasana intimate dan penuh cinta untuk momen spesial.",
        icon: "Heart",
        image: null,
        color: "from-red-400 to-orange-500",
        features: [
          "Sunset color gradient",
          "Romantic ambiance",
          "Warm tone palette",
          "Love-themed icons",
          "Intimate design",
        ],
        buttonText: "Lihat Tema Ini",
        buttonLink: "#themes",
        isActive: true,
        isFeatured: false,
        priority: 5,
      },
    }),

    // Service 6: Electric Blue
    prisma.service.upsert({
      where: { id: 6 },
      update: {},
      create: {
        title: "Electric Blue",
        description:
          "Tema modern dengan dominasi biru elektrik dan aksen silver. Bold, energik, dan penuh karakter untuk pasangan yang berani tampil beda.",
        icon: "Zap",
        image: null,
        color: "from-blue-400 to-cyan-500",
        features: [
          "Bold electric blue",
          "Modern & energetic",
          "Silver metallic accent",
          "Dynamic animations",
          "Contemporary style",
        ],
        buttonText: "Lihat Tema Ini",
        buttonLink: "#themes",
        isActive: false, // Inactive example
        isFeatured: false,
        priority: 6,
      },
    }),
  ]);

  console.log(`✅ Created ${services.length} services`);

  // ========================================
  // SUMMARY
  // ========================================
  console.log("\n📊 Seed Summary:");
  console.log("=====================================");
  console.log(`Services: ${services.length} created`);
  console.log(`Active Services: ${services.filter((s) => s.isActive).length}`);
  console.log(
    `Featured Services: ${services.filter((s) => s.isFeatured).length}`
  );
  console.log("=====================================\n");
}

main()
  .then(async () => {
    console.log("✅ Seed completed successfully!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
