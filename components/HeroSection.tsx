"use client";

import {
  animate,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, ArrowDown, Star, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface HeroTheme {
  id: number;
  name: string;
  image: string | null;
}

// Deterministic shuffle (stable across SSR/hydration)
function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function splitColumnPools(pool: HeroTheme[]): HeroTheme[][] {
  const shuffled = seededShuffle(
    pool,
    pool.reduce((sum, t) => sum + t.id, 0),
  );
  const cols: HeroTheme[][] = [[], [], []];
  shuffled.forEach((item, i) => cols[i % 3].push(item));
  return cols;
}

function buildColumnLoop(
  pool: HeroTheme[],
  columnIndex: number,
  halfSize: number,
): HeroTheme[] {
  if (pool.length === 0) return [];

  const fillHalf = (seed: number, avoidId?: number): HeroTheme[] => {
    const half: HeroTheme[] = [];
    let attempt = 0;

    while (half.length < halfSize) {
      const shuffled = seededShuffle(pool, seed + attempt);
      for (const item of shuffled) {
        const lastId = half.length > 0 ? half[half.length - 1].id : avoidId;
        if (lastId === item.id) continue;
        half.push(item);
        if (half.length >= halfSize) break;
      }

      attempt++;
      if (attempt > 24) {
        const fallback = pool[half.length % pool.length];
        if (half.length === 0 || half[half.length - 1].id !== fallback.id) {
          half.push(fallback);
        } else {
          half.push(pool[(half.length + 1) % pool.length]);
        }
      }
    }

    return half;
  };

  const seed = columnIndex * 7919 + pool.reduce((sum, t) => sum + t.id, 0);
  const first = fillHalf(seed);
  const second = fillHalf(seed + 500, first[first.length - 1]?.id);

  return [...first, ...second];
}

function buildMarqueeColumns(pool: HeroTheme[]): HeroTheme[][] {
  const columnPools = splitColumnPools(pool);

  return columnPools.map((columnPool, i) => {
    if (columnPool.length === 0) return [];
    const halfSize = Math.max(4, columnPool.length + 1);
    return buildColumnLoop(columnPool, i, halfSize);
  });
}

const MARQUEE_DURATION = 30;
const MARQUEE_Y_VALUES = [0, -14, -14, -27, -27, -38, -38, -50];
const MARQUEE_Y_TIMES = [0, 0.16, 0.28, 0.44, 0.55, 0.72, 0.84, 1];
const MARQUEE_SCALE = [1, 1, 1.05, 1.05, 1, 1, 1.05, 1.05, 1];
const MARQUEE_SCALE_TIMES = [
  0, 0.16, 0.22, 0.28, 0.44, 0.5, 0.55, 0.72, 0.84, 1,
];

function MarqueeColumn({
  images,
  direction,
  yProgress,
  scaleProgress,
  className = "flex-1",
}: {
  images: HeroTheme[];
  direction: "up" | "down";
  yProgress: MotionValue<number>;
  scaleProgress: MotionValue<number>;
  className?: string;
}) {
  const list = images;
  // Up: 0% → -50%. Down: -50% → 0% (mirrored path, same negative translateY range).
  const y = useTransform(yProgress, (v) =>
    direction === "up" ? `${v}%` : `${-50 - v}%`,
  );

  return (
    <div className={`${className} overflow-hidden`}>
      <motion.div
        className="flex flex-col"
        style={{ y, scale: scaleProgress, transformOrigin: "center center" }}
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

function HeroMarquee({ columns }: { columns: HeroTheme[][] }) {
  const yProgress = useMotionValue(0);
  const scaleProgress = useMotionValue(1);

  useEffect(() => {
    const yControls = animate(yProgress, MARQUEE_Y_VALUES, {
      duration: MARQUEE_DURATION,
      times: MARQUEE_Y_TIMES,
      repeat: Infinity,
      ease: "easeInOut",
    });
    const scaleControls = animate(scaleProgress, MARQUEE_SCALE, {
      duration: MARQUEE_DURATION,
      times: MARQUEE_SCALE_TIMES,
      repeat: Infinity,
      ease: "easeInOut",
    });

    return () => {
      yControls.stop();
      scaleControls.stop();
    };
  }, [yProgress, scaleProgress]);

  return (
    <>
      {columns.map((col, i) =>
        col.length > 0 ? (
          <MarqueeColumn
            key={i}
            images={col}
            direction={i === 1 ? "down" : "up"}
            yProgress={yProgress}
            scaleProgress={scaleProgress}
          />
        ) : null,
      )}
    </>
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
          .filter(
            (
              t: HeroTheme & {
                image2?: string | null;
                imageActive?: boolean;
                image2Active?: boolean;
              },
            ) => {
              if (heroPreviewImage === 2) {
                return t.image2 && t.image2Active !== false;
              }
              return t.image && t.imageActive !== false;
            },
          )
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

  const columns = useMemo(() => {
    const pool: HeroTheme[] =
      themes.length > 0
        ? themes
        : Array.from({ length: 9 }, (_, i) => ({
            id: -(i + 1),
            name: "placeholder",
            image: null,
          }));

    return buildMarqueeColumns(pool);
  }, [themes]);

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
          className="relative h-[45vh] md:h-[78vh] flex gap-2.5 md:gap-4 [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
        >
          <HeroMarquee columns={columns} />
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
