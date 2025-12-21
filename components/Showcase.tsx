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
  ChevronLeft,
  ChevronRight,
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

// Items per page
const ITEMS_PER_PAGE = 9;

export default function Showcase() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [themes, setThemes] = useState<Theme[]>([]);
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [loading, setLoading] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);

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

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  // Filter themes
  const filteredThemes =
    activeCategory === "All"
      ? themes
      : themes.filter((t) =>
          t.categories.some((cat) => cat.name === activeCategory)
        );

  // Pagination calculation
  const totalPages = Math.ceil(filteredThemes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentThemes = filteredThemes.slice(startIndex, endIndex);

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
    // Scroll to top of section
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      goToPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      goToPage(currentPage - 1);
    }
  };

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

      {/* CATEGORY FILTER - 3 ROWS SCROLLABLE ON MOBILE */}
      <div className="mb-8 sm:mb-10 md:mb-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Mobile: 3 rows with horizontal scroll per row */}
          <div className="sm:hidden space-y-2">
            {/* Split categories into 3 groups for mobile */}
            {[0, 1, 2].map((rowIndex) => {
              const rowCategories = categories.filter(
                (_, index) => index % 3 === rowIndex
              );
              if (rowCategories.length === 0) return null;

              return (
                <div key={rowIndex} className="overflow-x-auto scrollbar-hide">
                  <div className="flex gap-2 pb-1 min-w-max">
                    {rowCategories.map((cat) => {
                      const isActive = activeCategory === cat;
                      const count = getCategoryCount(cat);
                      return (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`relative px-3 py-2 rounded-full text-xs font-semibold border-2 transition-all duration-300 overflow-hidden whitespace-nowrap touch-manipulation active:scale-95 ${
                            isActive
                              ? "border-transparent text-white shadow-lg"
                              : "text-[#b38b00] border-[#d4af37]/30 bg-white/50 backdrop-blur-sm"
                          }`}
                        >
                          {isActive && (
                            <span className="absolute inset-0 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37]" />
                          )}
                          <span className="relative z-10 flex items-center gap-1.5">
                            {cat}
                            <span
                              className={`inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[10px] font-bold ${
                                isActive
                                  ? "bg-white/20 text-white"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {count}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            {/* Scroll hint */}
            <div className="flex justify-center pt-1">
              <p className="text-[10px] text-[#6b4e2f]/40">
                ← Swipe untuk kategori lainnya →
              </p>
            </div>
          </div>

          {/* Tablet/Desktop: Normal wrap layout */}
          <div className="hidden sm:flex flex-wrap justify-center gap-2 sm:gap-3">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              const count = getCategoryCount(cat);
              return (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-4 py-2.5 md:px-6 md:py-3 rounded-full text-sm font-semibold border-2 transition-all duration-300 overflow-hidden group whitespace-nowrap ${
                    isActive
                      ? "border-transparent text-white shadow-lg"
                      : "text-[#b38b00] border-[#d4af37]/30 hover:border-[#d4af37] bg-white/50 backdrop-blur-sm"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategory"
                      className="absolute inset-0 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37]"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {cat}
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold ${
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
        </div>
      </div>

      {/* Scrollbar hide CSS - keep this */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* RESULTS INFO */}
      {!loading && filteredThemes.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6 sm:mb-8 px-4"
        >
          <p className="text-sm text-[#6b4e2f]/60">
            Menampilkan {startIndex + 1}-
            {Math.min(endIndex, filteredThemes.length)} dari{" "}
            {filteredThemes.length} tema
          </p>
        </motion.div>
      )}

      {/* LOADING STATE - Skeleton */}
      {loading && (
        <div className="relative grid gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4 sm:px-6 md:px-12 lg:px-24 grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              className="relative rounded-2xl overflow-hidden bg-white shadow-lg border border-amber-100"
            >
              <div className="w-full h-48 sm:h-56 md:h-64 lg:h-72 bg-gradient-to-br from-amber-50 to-yellow-50 animate-pulse" />
              <div className="p-3 sm:p-4 md:p-6 space-y-2 sm:space-y-3">
                <div className="h-4 sm:h-5 md:h-6 bg-amber-100 rounded animate-pulse" />
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

      {/* THEMES GRID - 2 COLUMNS ON MOBILE */}
      {!loading && currentThemes.length > 0 && (
        <div className="relative grid gap-3 sm:gap-6 md:gap-8 lg:gap-10 px-4 sm:px-6 md:px-12 lg:px-24 grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {currentThemes.map((theme, index) => (
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
                className="relative rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden group shadow-lg hover:shadow-2xl transition-all duration-500 bg-white border border-amber-100/50"
              >
                {/* Tags from Database - FULLY RESPONSIVE */}
                {theme.tags.length > 0 && (
                  <div className="absolute top-1.5 left-1.5 sm:top-3 sm:left-3 md:top-4 md:left-4 z-20 flex flex-wrap gap-1 sm:gap-1.5 max-w-[calc(100%-12px)] sm:max-w-[calc(100%-24px)]">
                    {theme.tags.map((tag, tagIndex) => {
                      const IconComponent = getIconComponent(tag.icon);

                      return (
                        <motion.div
                          key={tag.id}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: 0.2 + tagIndex * 0.1 }}
                          className={`flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-gradient-to-r ${
                            tag.color
                          } text-white text-[9px] sm:text-xs font-bold shadow-lg ${
                            tagIndex >= 3 ? "hidden sm:flex" : ""
                          } ${tagIndex >= 3 ? "lg:flex" : ""}`}
                        >
                          <IconComponent className="w-2 h-2 sm:w-3 sm:h-3 flex-shrink-0" />
                          <span className="truncate max-w-[60px] sm:max-w-none">
                            {tag.name}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Image with hover zoom - MOBILE OPTIMIZED */}
                <div className="relative h-40 sm:h-56 md:h-64 lg:h-72 w-full overflow-hidden bg-gradient-to-br from-amber-100 to-yellow-100">
                  {theme.image ? (
                    <>
                      {theme.image.includes("cloudinary.com") ? (
                        <Image
                          src={theme.image}
                          alt={theme.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
                          quality={85}
                          priority={index < 6}
                        />
                      ) : (
                        <img
                          src={theme.image}
                          alt={theme.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
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
                      <Sparkles className="w-8 h-8 sm:w-12 sm:h-12 text-amber-300" />
                    </div>
                  )}
                </div>

                {/* Card Content - MOBILE OPTIMIZED */}
                <div className="relative p-2.5 sm:p-4 md:p-6 bg-gradient-to-b from-white to-amber-50/30">
                  <div className="flex items-start justify-between mb-1.5 sm:mb-3">
                    <h3 className="text-xs sm:text-lg md:text-xl font-bold text-[#3b2a1a] group-hover:text-[#d4af37] transition-colors line-clamp-2 flex-1 pr-1 sm:pr-2">
                      {theme.name}
                    </h3>
                    <motion.div
                      whileHover={{ rotate: 180, scale: 1.2 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <Star className="w-3 h-3 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />
                    </motion.div>
                  </div>

                  {/* Categories Pills - MOBILE OPTIMIZED */}
                  <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-4">
                    {theme.categories.slice(0, 1).map((cat) => (
                      <span
                        key={cat.id}
                        className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-amber-100/80 backdrop-blur-sm text-amber-800 rounded-full text-[9px] sm:text-xs font-medium"
                      >
                        {cat.name}
                      </span>
                    ))}
                    {theme.categories.length > 1 && (
                      <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 bg-amber-50 text-amber-600 rounded-full text-[9px] sm:text-xs font-medium">
                        +{theme.categories.length - 1}
                      </span>
                    )}
                  </div>

                  {/* Price - MOBILE OPTIMIZED */}
                  <div className="mb-2 sm:mb-4">
                    <p className="text-[9px] sm:text-xs text-[#6b4e2f]/60 mb-0.5">
                      Harga Mulai
                    </p>
                    <p className="text-sm sm:text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] to-[#b38b00]">
                      Rp {theme.price.toLocaleString("id-ID")}
                    </p>
                  </div>

                  {/* Action Buttons - MOBILE OPTIMIZED */}
                  <div className="flex gap-1.5 sm:gap-3">
                    <motion.a
                      href={theme.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-white border-2 border-amber-200 text-amber-800 px-2 py-1.5 sm:px-4 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold text-[10px] sm:text-sm hover:border-amber-300 hover:bg-amber-50 transition-all shadow-sm"
                    >
                      <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className=" sm:inline">Lihat</span>
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
                      className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] text-white px-2 py-1.5 sm:px-4 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl font-semibold text-[10px] sm:text-sm shadow-lg hover:shadow-xl transition-all"
                    >
                      <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className=" sm:inline">Pesan</span>
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

      {/* PAGINATION - MOBILE FIXED & IMPROVED */}
      {!loading && filteredThemes.length > ITEMS_PER_PAGE && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 sm:mt-12 md:mt-16 px-4"
        >
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            {/* Previous Button */}
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl font-semibold transition-all touch-manipulation ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border-2 border-amber-200 text-amber-800 hover:border-amber-300 hover:bg-amber-50 shadow-sm active:scale-95"
              }`}
            >
              <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>

            {/* Page Numbers - FIXED FOR MOBILE */}
            <div className="flex gap-1 sm:gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => {
                  // Show first page, last page, current page, and adjacent pages
                  const showPage =
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(page - currentPage) <= 1;

                  // Show ellipsis
                  const showEllipsis =
                    (page === 2 && currentPage > 3) ||
                    (page === totalPages - 1 && currentPage < totalPages - 2);

                  if (!showPage && !showEllipsis) return null;

                  if (showEllipsis) {
                    return (
                      <span
                        key={`ellipsis-${page}`}
                        className="px-2 sm:px-3 py-2 sm:py-2 text-[#6b4e2f]/60 text-sm sm:text-sm"
                      >
                        ...
                      </span>
                    );
                  }

                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`min-w-[40px] sm:min-w-[44px] h-[40px] sm:h-[44px] px-3 sm:px-4 rounded-lg sm:rounded-xl font-semibold text-sm sm:text-sm transition-all touch-manipulation active:scale-95 ${
                        currentPage === page
                          ? "bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] text-white shadow-lg"
                          : "bg-white border-2 border-amber-200 text-amber-800 hover:border-amber-300 hover:bg-amber-50 shadow-sm"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
              )}
            </div>

            {/* Next Button */}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`p-2 sm:p-2.5 rounded-lg sm:rounded-xl font-semibold transition-all touch-manipulation ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-white border-2 border-amber-200 text-amber-800 hover:border-amber-300 hover:bg-amber-50 shadow-sm active:scale-95"
              }`}
            >
              <ChevronRight className="w-5 h-5 sm:w-5 sm:h-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* Bottom CTA - MOBILE OPTIMIZED */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        viewport={{ once: true }}
        className="text-center mt-12 sm:mt-16 md:mt-20 px-4"
      >
        <p className="text-[#6b4e2f]/80 mb-4 sm:mb-6 text-xs sm:text-base">
          Tidak menemukan tema yang cocok?
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-5 py-2.5 sm:px-8 sm:py-4 bg-gradient-to-r from-[#d4af37] to-[#b38b00] text-white rounded-full font-semibold shadow-xl hover:shadow-2xl transition-all text-xs sm:text-base"
        >
          Request Custom Design
        </motion.button>
      </motion.div>
    </section>
  );
}
