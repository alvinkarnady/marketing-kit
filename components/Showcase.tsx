"use client";

import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import {
  ExternalLink,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Star,
  Zap,
  Heart,
  Crown,
  Award,
  Flame,
} from "lucide-react";

interface Category {
  id: number;
  name: string;
}

interface Tag {
  id: number;
  name: string;
  color: string;
  icon: string;
}

interface Theme {
  id: number;
  name: string;
  price: number;
  image: string | null;
  demoUrl: string;
  categories: Category[];
  tags: Tag[];
}

// Icon mapping
const iconMap: Record<string, any> = {
  Sparkles,
  TrendingUp,
  Star,
  Zap,
  Heart,
  Crown,
  Award,
  Flame,
};

export default function Showcase() {
  const ref = useRef(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Fetch themes and categories from backend
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const themesRes = await fetch("/api/themes");
        const themesData = await themesRes.json();

        const categoriesRes = await fetch("/api/categories");
        const categoriesData = await categoriesRes.json();

        setThemes(themesData.data || []);

        const categoryNames = categoriesData.map((cat: Category) => cat.name);
        setCategories(["All", ...categoryNames]);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter themes
  const filteredThemes =
    activeCategory === "All"
      ? themes
      : themes.filter((t) =>
          t.categories.some((cat) => cat.name === activeCategory)
        );

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], [0, -40]);

  // WhatsApp message generator
  const getWhatsAppLink = (theme: Theme) => {
    const message = `Halo, saya tertarik dengan tema undangan "${
      theme.name
    }" seharga Rp ${theme.price.toLocaleString(
      "id-ID"
    )}. Bisa info lebih lanjut?`;
    const phone = "6281248406898";
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  };

  // Count themes per category
  const getCategoryCount = (categoryName: string) => {
    if (categoryName === "All") return themes.length;
    return themes.filter((t) =>
      t.categories.some((cat) => cat.name === categoryName)
    ).length;
  };

  // Get Icon Component
  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Sparkles;
  };

  return (
    <section
      ref={ref}
      id="gallery"
      className="relative py-16 sm:py-20 md:py-28 overflow-hidden bg-gradient-to-b from-white via-amber-50/30 to-white text-[#3b2a1a]"
    >
      {/* Animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute top-20 right-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-amber-200/30 to-yellow-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, delay: 2 }}
        className="absolute bottom-20 left-0 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-tl from-amber-300/20 to-yellow-200/30 rounded-full blur-3xl"
      />

      {/* Heading */}
      <motion.div
        style={{ y: yText }}
        className="relative text-center mb-10 sm:mb-12 md:mb-16 px-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 mb-4 sm:mb-6"
        >
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600" />
          <span className="text-xs sm:text-sm font-medium text-amber-800">
            Premium Collection
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#b38b00]">
            Koleksi Tema
          </span>
          <br />
          <span className="text-[#3b2a1a]">Undangan Digital</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-[#6b4e2f]/80 max-w-2xl mx-auto text-sm sm:text-base md:text-lg"
        >
          Pilih tema undangan digital yang mencerminkan kisah cinta Anda — dari
          nuansa premium, luxury, hingga floral romantis.
        </motion.p>
      </motion.div>

      {/* CATEGORY FILTER - RESPONSIVE */}
      <div className="flex justify-center gap-2 sm:gap-3 mb-10 sm:mb-12 md:mb-16 px-4 flex-wrap max-w-4xl mx-auto">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          const count = getCategoryCount(cat);
          return (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-full text-xs sm:text-sm font-semibold border-2 transition-all duration-300 overflow-hidden group ${
                isActive
                  ? "border-transparent text-white shadow-lg"
                  : "text-[#b38b00] border-[#d4af37]/30 hover:border-[#d4af37] bg-white/50 backdrop-blur-sm"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5 sm:gap-2">
                {cat}
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`inline-flex items-center justify-center min-w-[18px] sm:min-w-[20px] h-4 sm:h-5 px-1 sm:px-1.5 rounded-full text-[10px] sm:text-xs font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {count}
                </motion.span>
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* LOADING STATE - Skeleton */}
      {loading && (
        <div className="relative grid gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4 sm:px-6 md:px-12 lg:px-24 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden bg-white shadow-lg border border-amber-100"
            >
              <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-br from-amber-50 to-yellow-50 animate-pulse" />
              <div className="p-4 sm:p-5 md:p-6 space-y-3">
                <div className="h-5 sm:h-6 bg-amber-100 rounded animate-pulse" />
                <div className="h-3 sm:h-4 bg-amber-50 rounded w-3/4 animate-pulse" />
                <div className="h-8 sm:h-9 md:h-10 bg-amber-100 rounded animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && filteredThemes.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12 sm:py-16 md:py-20"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-amber-100 mb-4">
            <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
          </div>
          <p className="text-lg sm:text-xl text-[#6b4e2f]/60 mb-2">
            Tidak ada tema tersedia
          </p>
          <p className="text-xs sm:text-sm text-[#6b4e2f]/40">
            Coba pilih kategori lain
          </p>
        </motion.div>
      )}

      {/* THEMES GRID - RESPONSIVE */}
      {!loading && filteredThemes.length > 0 && (
        <div className="relative grid gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4 sm:px-6 md:px-12 lg:px-24 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filteredThemes.map((theme, index) => (
              <motion.div
                key={theme.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  layout: { duration: 0.3 },
                }}
                onHoverStart={() => setHoveredCard(theme.id)}
                onHoverEnd={() => setHoveredCard(null)}
                className="relative rounded-2xl sm:rounded-3xl overflow-hidden group shadow-xl hover:shadow-2xl transition-all duration-500 bg-white border border-amber-100/50"
              >
                {/* Tags from Database - RESPONSIVE */}
                {theme.tags.length > 0 && (
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 md:top-4 md:left-4 z-20 flex flex-col gap-1.5 sm:gap-2">
                    {theme.tags.map((tag, tagIndex) => {
                      const IconComponent = getIconComponent(tag.icon);
                      return (
                        <motion.div
                          key={tag.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 + tagIndex * 0.1 }}
                          className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-full bg-gradient-to-r ${tag.color} text-white text-[10px] sm:text-xs font-bold shadow-lg`}
                        >
                          <IconComponent size={10} className="sm:w-3 sm:h-3" />
                          {tag.name}
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Image with hover zoom - RESPONSIVE */}
                <div className="relative h-48 sm:h-56 md:h-64 lg:h-72 w-full overflow-hidden bg-gradient-to-br from-amber-100 to-yellow-100">
                  {theme.image ? (
                    <>
                      <Image
                        src={theme.image}
                        alt={theme.name}
                        width={400}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Shine effect on hover */}
                      <motion.div
                        initial={{ x: "-100%" }}
                        animate={
                          hoveredCard === theme.id
                            ? { x: "100%" }
                            : { x: "-100%" }
                        }
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-amber-600 text-sm sm:text-base md:text-lg font-medium">
                        No Image
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content - RESPONSIVE */}
                <div className="relative p-4 sm:p-5 md:p-6 bg-gradient-to-b from-white to-amber-50/30">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#3b2a1a] group-hover:text-[#d4af37] transition-colors line-clamp-2 flex-1 pr-2">
                      {theme.name}
                    </h3>
                    <motion.div
                      whileHover={{ rotate: 180, scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
                    </motion.div>
                  </div>

                  {/* Categories Pills - RESPONSIVE */}
                  <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
                    {theme.categories.slice(0, 2).map((cat) => (
                      <span
                        key={cat.id}
                        className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-amber-100/80 backdrop-blur-sm text-amber-800 rounded-full text-[10px] sm:text-xs font-medium"
                      >
                        {cat.name}
                      </span>
                    ))}
                    {theme.categories.length > 2 && (
                      <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] sm:text-xs font-medium">
                        +{theme.categories.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Price - RESPONSIVE */}
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div>
                      <p className="text-[10px] sm:text-xs text-[#6b4e2f]/60 mb-0.5 sm:mb-1">
                        Harga Mulai
                      </p>
                      <p className="text-lg sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] to-[#b38b00]">
                        Rp {theme.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons - RESPONSIVE */}
                  <div className="flex gap-2 sm:gap-3">
                    <motion.a
                      href={theme.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-white border-2 border-amber-200 text-amber-800 px-3 py-2 sm:px-4 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm hover:border-amber-300 hover:bg-amber-50 transition-all shadow-sm"
                    >
                      <ExternalLink size={14} className="sm:w-4 sm:h-4" />
                      Demo
                    </motion.a>

                    <motion.a
                      href={getWhatsAppLink(theme)}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{
                        scale: 1.05,
                        boxShadow: "0 10px 30px rgba(212, 175, 55, 0.3)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-1.5 sm:gap-2 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] text-white px-3 py-2 sm:px-4 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all"
                    >
                      <MessageCircle size={14} className="sm:w-4 sm:h-4" />
                      Pesan
                    </motion.a>
                  </div>
                </div>

                {/* Glow effect on hover */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCard === theme.id ? 1 : 0 }}
                  className="absolute inset-0 bg-gradient-to-t from-amber-400/10 via-transparent to-transparent pointer-events-none"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Bottom CTA - RESPONSIVE */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="text-center mt-12 sm:mt-16 md:mt-20 px-4"
      >
        <p className="text-[#6b4e2f]/80 mb-4 sm:mb-6 text-sm sm:text-base">
          Tidak menemukan tema yang cocok?
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-[#d4af37] to-[#b38b00] text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all text-sm sm:text-base"
        >
          Request Custom Design
        </motion.button>
      </motion.div>
    </section>
  );
}
