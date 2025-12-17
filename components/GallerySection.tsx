"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

const themes = [
  {
    id: 1,
    name: "Elegant Wedding",
    image: "/themes/minimalist-parallax-1.jpg",
    demo: "https://contoh-tema1.vercel.app",
  },
  {
    id: 2,
    name: "Rustic Garden",
    image: "/themes/minimalist-parallax-2.jpg",
    demo: "https://contoh-tema2.vercel.app",
  },
  {
    id: 3,
    name: "Modern Minimalist",
    image: "/themes/minimalist-parallax-3.jpg",
    demo: "https://contoh-tema3.vercel.app",
  },
  {
    id: 4,
    name: "Classic Gold",
    image: "/themes/minimalist-parallax-4.jpg",
    demo: "https://contoh-tema4.vercel.app",
  },
];

export default function GallerySection() {
  return (
    <section className="py-24 px-6 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="max-w-6xl mx-auto text-center"
      >
        <h2 className="text-4xl font-semibold text-gray-800 mb-4">
          Koleksi Tema Undangan Kami
        </h2>
        <p className="text-gray-600 mb-12">
          Pilih tema undangan online sesuai gayamu — elegan, modern, hingga
          klasik.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {themes.map((theme) => (
            <motion.div
              key={theme.id}
              whileHover={{ scale: 1.03 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="rounded-2xl overflow-hidden shadow-lg bg-white border border-gray-100 group"
            >
              <div className="relative w-full h-60">
                <Image
                  src={theme.image}
                  alt={theme.name}
                  fill
                  className="object-cover group-hover:brightness-90 transition-all duration-300"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {theme.name}
                </h3>
                <motion.a
                  whileHover={{ scale: 1.05 }}
                  href={theme.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-purple-600 hover:text-purple-800 font-medium transition"
                >
                  <ExternalLink size={18} /> Lihat Demo
                </motion.a>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
