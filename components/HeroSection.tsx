"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown, Star, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface HeroTheme {
  id: number;
  name: string;
  image: string | null;
}

// Split items into n columns round-robin
function splitColumns<T>(items: T[], count: number): T[][] {
  const cols: T[][] = Array.from({ length: count }, () => []);
  items.forEach((item, i) => cols[i % count].push(item));
  return cols;
}

// Keyframes with smooth holds: the column glides, eases to a stop, then continues
function buildPausedKeyframes(direction: "up" | "down") {
  const stops = ["0%", "-14%", "-14%", "-27%", "-27%", "-38%", "-38%", "-50%"];
  const frames = direction === "up" ? stops : [...stops].reverse();
  // Uneven timing: longer segments are travel, equal pairs are pauses
  const times = [0, 0.16, 0.28, 0.44, 0.55, 0.72, 0.84, 1];
  return { frames, times };
}

function MarqueeColumn({
  images,
  direction,
  duration,
  zoomDelay,
  className = "flex-1",
}: {
  images: HeroTheme[];
  direction: "up" | "down";
  duration: number;
  zoomDelay: number;
  className?: string;
}) {
  // Duplicate list so the loop is seamless at -50%
  const list = [...images, ...images];
  const { frames, times } = buildPausedKeyframes(direction);

  return (
    <div className={`${className} overflow-hidden`}>
      <motion.div
        className="flex flex-col"
        animate={{
          y: frames,
          scale: [1, 1, 1.05, 1.05, 1, 1],
        }}
        transition={{
          y: {
            duration,
            times,
            repeat: Infinity,
            ease: "easeInOut",
          },
          scale: {
            duration: duration / 2,
            times: [0, 0.35, 0.45, 0.55, 0.65, 1],
            repeat: Infinity,
            ease: "easeInOut",
            delay: zoomDelay,
          },
        }}
        style={{ transformOrigin: "center center" }}
      >
        {list.map((theme, i) => (
          <div
            key={`${theme.id}-${i}`}
            className="relative rounded-xl md:rounded-2xl overflow-hidden border border-amber-100 shadow-md shadow-amber-100/50 bg-white aspect-[9/16] w-full mb-3 md:mb-4"
          >
            {theme.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={theme.image}
                alt={theme.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-amber-50 to-yellow-100 animate-pulse" />
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const [themes, setThemes] = useState<HeroTheme[]>([]);

  useEffect(() => {
    async function fetchThemes() {
      try {
        const [settingsRes, themesRes] = await Promise.all([
          fetch("/api/theme-settings"),
          fetch("/api/themes"),
        ]);
        const settingsData = await settingsRes.json();
        const data = await themesRes.json();
        const heroPreviewImage = settingsData?.heroPreviewImage === 2 ? 2 : 1;

        const withImages = (data.data || [])
          .filter((t: HeroTheme & { image2?: string | null; imageActive?: boolean; image2Active?: boolean }) => {
            if (heroPreviewImage === 2) {
              return t.image2 && t.image2Active !== false;
            }
            return t.image && t.imageActive !== false;
          })
          .map((t: HeroTheme & { image2?: string | null }) => ({
            id: t.id,
            name: t.name,
            image: (heroPreviewImage === 2 ? t.image2 : t.image) as string,
          }));

        setThemes(withImages);
      } catch (error) {
        console.error("Failed to fetch themes:", error);
      }
    }
    fetchThemes();
  }, []);

  const scrollToGallery = () => {
    const gallery = document.getElementById("gallery");
    if (gallery) {
      gallery.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Placeholder skeletons keep the marquee alive before data arrives
  let marqueeItems: HeroTheme[] =
    themes.length > 0
      ? themes
      : Array.from({ length: 9 }, (_, i) => ({
          id: -(i + 1),
          name: "placeholder",
          image: null,
        }));

  // Repeat items so each column has enough cards for a seamless loop
  while (marqueeItems.length < 9) {
    marqueeItems = [...marqueeItems, ...marqueeItems];
  }

  const columns = splitColumns(marqueeItems, 3);
  const durations = [28, 34, 24];

  return (
    <section
      id="home"
      ref={ref}
      className="relative min-h-screen bg-gradient-to-b from-white via-amber-50/40 to-white text-[#3b2a1a] overflow-hidden"
    >
      {/* Soft static amber accents */}
      <div className="absolute top-[-10%] right-[-5%] w-[420px] h-[420px] bg-gradient-to-br from-amber-200/25 to-yellow-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[420px] h-[420px] bg-gradient-to-tr from-amber-300/15 to-yellow-200/25 rounded-full blur-3xl pointer-events-none" />

      {/* Floral line-art accents (Fairytale style) — white bg blended away via multiply */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/floral-accent.png"
        alt=""
        aria-hidden="true"
        className="absolute left-20 top-50 w-[640px] md:w-[800px] lg:w-[1000px] mix-blend-multiply opacity-40 pointer-events-none select-none -translate-x-[30%] -translate-y-[10%] rotate-40"
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/floral-accent.png"
        alt=""
        aria-hidden="true"
        className="absolute right-20 bottom-0 w-[640px] md:w-[800px] lg:w-[1000px] mix-blend-multiply opacity-40 pointer-events-none select-none scale-x-[-1] translate-x-[30%] translate-y-[15%] rotate-x-40"
      />

      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-8 items-center min-h-screen px-6 pt-28 pb-16 md:py-0">
        {/* ---------------- LEFT: Text ---------------- */}
        <motion.div
          style={{ y: yText, opacity }}
          className="text-center md:text-left"
        >
          {/* Rating & trust row */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start gap-2 sm:gap-3 mb-5"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-[#d4af37] fill-[#d4af37]"
                  />
                ))}
              </div>
              <span className="text-sm font-semibold">Rated 4.9/5</span>
            </div>
            <span className="text-sm text-[#6b5b45]">
              Dipercaya 500+ pasangan bahagia
            </span>
          </motion.div>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 mb-6"
          >
            <Sparkles className="w-4 h-4 text-[#b38b00]" />
            <span className="text-xs sm:text-sm font-medium text-[#7a5c2e]">
              Undangan Digital Premium
            </span>
          </motion.div>

          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Buat Undangan Digital{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#b38b00]">
              Modern & Elegan
            </span>
          </motion.h1>

          <motion.p
            className="text-[#6b5b45] text-sm sm:text-base md:text-lg mb-8 sm:mb-10 leading-relaxed max-w-xl mx-auto md:mx-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            Ciptakan pengalaman undangan digital yang berkesan — dengan desain
            menarik, fitur interaktif, dan kemudahan berbagi hanya dengan satu
            tautan.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-row flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.a
              href="#gallery"
              onClick={(e) => {
                e.preventDefault();
                scrollToGallery();
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center justify-center gap-1.5 px-4 sm:px-8 py-2.5 sm:py-4 rounded-full font-semibold text-xs sm:text-base whitespace-nowrap bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] text-[#3b2a1a] shadow-lg shadow-amber-200/60 hover:shadow-xl hover:shadow-amber-200/80 transition-shadow"
            >
              Lihat Tema
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </motion.a>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center px-4 sm:px-8 py-2.5 sm:py-4 rounded-full font-semibold text-xs sm:text-base whitespace-nowrap border-2 border-amber-300 text-[#3b2a1a] bg-white/60 hover:bg-amber-50 hover:border-amber-400 transition-colors"
            >
              Konsultasi Gratis
            </motion.a>
          </motion.div>
        </motion.div>

        {/* ---------------- RIGHT: Vertical marquee ---------------- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative h-[35vh] md:h-[78vh] flex gap-2.5 md:gap-4 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
        >
          {columns.map((col, i) =>
            col.length > 0 ? (
              <MarqueeColumn
                key={i}
                images={col}
                direction={i % 2 === 0 ? "up" : "down"}
                duration={durations[i % durations.length]}
                zoomDelay={i * 5}
              />
            ) : null,
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 hidden md:block"
      >
        <motion.button
          onClick={scrollToGallery}
          className="flex flex-col items-center gap-2 text-[#a08a68] hover:text-[#3b2a1a] transition-colors cursor-pointer"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-medium tracking-wider uppercase">
            Scroll
          </span>
          <ArrowDown className="w-5 h-5" />
        </motion.button>
      </motion.div>
    </section>
  );
}
