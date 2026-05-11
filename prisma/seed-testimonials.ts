const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const testimonials = [
    {
      name: "Budi & Siti",
      text: "Sangat membantu buat undangan digital yang elegan. Desainnya premium dan gampang diatur!",
      event: "Wedding of Budi & Siti",
      rating: 5,
    },
    {
      name: "Andi & Rina",
      text: "Fiturnya lengkap banget, ada RSVP dan maps. Tamu undangan banyak yang puji undangannya bagus.",
      event: "Wedding of Andi & Rina",
      rating: 5,
    },
    {
      name: "Rizky & Putri",
      text: "Gak nyesel pilih Piawai Invitation. Prosesnya cepet dan hasilnya memuaskan banget.",
      event: "Wedding of Rizky & Putri",
      rating: 5,
    },
    {
      name: "Dimas & Amanda",
      text: "Undangan digital paling praktis yang pernah saya coba. Harganya juga sangat terjangkau.",
      event: "Wedding of Dimas & Amanda",
      rating: 4,
    },
    {
      name: "Fajar & Melati",
      text: "Pilihan temanya banyak dan cantik-cantik. Sangat merekomendasikan buat pasangan yang mau nikah.",
      event: "Wedding of Fajar & Melati",
      rating: 5,
    },
    {
      name: "Eko & Sari",
      text: "Customer servicenya ramah dan sangat membantu pas saya bingung pilih tema.",
      event: "Wedding of Eko & Sari",
      rating: 5,
    },
    {
      name: "Hendra & Linda",
      text: "Linknya gampang di-share ke WhatsApp dan sosial media. Sangat efisien!",
      event: "Wedding of Hendra & Linda",
      rating: 5,
    },
    {
      name: "Kevin & Jessica",
      text: "Desainnya modern dan gak kaku. Banyak opsi kustomisasi yang bikin undangan jadi unik.",
      event: "Wedding of Kevin & Jessica",
      rating: 4,
    },
    {
      name: "Yoga & Dwi",
      text: "Hemat biaya dibanding cetak undangan fisik. Lebih ramah lingkungan juga!",
      event: "Wedding of Yoga & Dwi",
      rating: 5,
    },
    {
      name: "Aditya & Vina",
      text: "Proses aktivasinya instan. Begitu bayar langsung bisa dipakai.",
      event: "Wedding of Aditya & Vina",
      rating: 5,
    },
    {
      name: "Satria & Intan",
      text: "Dashboard adminnya user-friendly. Gampang buat update info acara kalau ada perubahan.",
      event: "Wedding of Satria & Intan",
      rating: 5,
    },
    {
      name: "Bagus & Dian",
      text: "Animasi di undangannya halus dan terlihat mewah. Mantap sekali!",
      event: "Wedding of Bagus & Dian",
      rating: 5,
    },
    {
      name: "Rama & Shinta",
      text: "Bisa tambah musik kesukaan. Bikin suasana undangan jadi lebih personal.",
      event: "Wedding of Rama & Shinta",
      rating: 5,
    },
    {
      name: "Guntur & Ayu",
      text: "Tamu gampang kasih ucapan dan doa lewat fitur buku tamu digital.",
      event: "Wedding of Guntur & Ayu",
      rating: 4,
    },
    {
      name: "Indra & Gita",
      text: "Sangat puas dengan layanannya. Terima kasih Piawai Invitation sudah jadi bagian dari hari bahagia kami.",
      event: "Wedding of Indra & Gita",
      rating: 5,
    },
  ];

  console.log("Seeding testimonials...");

  for (const t of testimonials) {
    await prisma.testimonial.create({
      data: {
        ...t,
        isActive: true,
        isApproved: true,
        isFeatured: true,
        role: "Pasangan Pengantin",
      },
    });
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
