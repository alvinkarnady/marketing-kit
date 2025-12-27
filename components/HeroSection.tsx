"use client";

import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  ArrowRight,
  ArrowDown,
  Star,
  Users,
  Heart,
  Sparkles,
} from "lucide-react";
import { useEffect, useState, useRef, JSX } from "react";

export default function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax transforms
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yButton = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  // Animated particles
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const particleCount = 60;
    const generatedParticles = [...Array(particleCount)].map((_, i) => {
      const size = Math.random() * 6 + 2;
      const opacity = 0.1 + Math.random() * 0.3;
      const duration = 2 + Math.random() * 3;
      const isGold = Math.random() > 0.5;

      return (
        <motion.span
          key={i}
          className="absolute rounded-full"
          style={{
            backgroundColor: isGold
              ? "rgba(255, 215, 0, 0.4)"
              : "rgba(255, 255, 255, 0.3)",
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity,
            boxShadow: isGold ? "0 0 10px rgba(255, 215, 0, 0.3)" : "none",
          }}
          animate={{
            y: [0, -60, 0],
            x: [0, Math.random() * 40 - 20, 0],
            opacity: [opacity, opacity + 0.3, opacity],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut",
          }}
        />
      );
    });

    setParticles(generatedParticles);
  }, []);

  // Smooth scroll to next section
  const scrollToGallery = () => {
    const gallery = document.getElementById("gallery");
    if (gallery) {
      gallery.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 text-white overflow-hidden px-6"
    >
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: "url('/images/ring.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-purple-900/60 to-indigo-900/40" />

      {/* Gold accent gradient overlays */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-400/20 to-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-400/20 to-yellow-500/10 rounded-full blur-3xl" />

      {/* Decorative Blobs with parallax */}
      <motion.div
        style={{ x: smoothMouseX, y: smoothMouseY }}
        className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-gradient-to-br from-purple-400/30 to-pink-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.4, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        style={{
          x: useTransform(smoothMouseX, (x) => -x),
          y: useTransform(smoothMouseY, (y) => -y),
        }}
        className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-gradient-to-tl from-blue-400/30 to-indigo-500/20 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles}
      </div>

      {/* Floating decorative shapes */}
      <motion.div
        style={{ x: smoothMouseX, y: smoothMouseY }}
        className="absolute top-20 left-20 w-20 h-20 border-2 border-yellow-300/30 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        style={{
          x: useTransform(smoothMouseX, (x) => -x * 0.5),
          y: useTransform(smoothMouseY, (y) => -y * 0.5),
        }}
        className="absolute bottom-40 right-32 w-16 h-16 border-2 border-amber-300/40 rounded-lg"
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      {/* Content */}
      <motion.div
        style={{ y: yText, opacity, scale }}
        className="relative z-10 max-w-4xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span className="text-xs sm:text-sm font-medium text-white/90">
            Undangan Digital Premium
          </span>
        </motion.div>

        <motion.h1
          className="text-3xl sm:text-4xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          Buat Undangan Digital <br />
          <span className="relative inline-block">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500">
              Modern & Elegan
            </span>
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-yellow-300/20 via-amber-400/20 to-yellow-500/20 blur-lg -z-10"
              animate={{ opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </span>
        </motion.h1>

        <motion.p
          className="text-white/80 text-sm sm:text-base md:text-lg lg:text-xl mb-8 sm:mb-10 leading-relaxed max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          Ciptakan pengalaman undangan digital yang berkesan — dengan desain
          menarik, fitur interaktif, dan kemudahan berbagi hanya dengan satu
          tautan.
        </motion.p>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-8 mb-10 sm:mb-12"
        >
          <div className="flex items-center gap-2 text-white/90">
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
              <Users className="w-4 h-4 text-yellow-300 mr-1.5" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                500+
              </span>
            </div>
            <span className="text-xs sm:text-sm md:text-base lg:text-lg">
              Pasangan Bahagia
            </span>
          </div>

          <div className="flex items-center gap-2 text-white/90">
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
              <div className="flex items-center mr-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                4.9
              </span>
            </div>
            <span className="text-xs sm:text-sm md:text-base lg:text-lg">
              Rating
            </span>
          </div>

          <div className="flex items-center gap-2 text-white/90">
            <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">
              <Heart className="w-4 h-4 text-pink-400 mr-1.5 fill-pink-400" />
              <span className="text-xs sm:text-sm md:text-base lg:text-lg font-semibold">
                100%
              </span>
            </div>
            <span className="text-xs sm:text-sm md:text-sm lg:text-base">
              Kepuasan
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        style={{ y: yButton, opacity }}
        className="relative z-10 flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8 }}
      >
        <motion.a
          href="#gallery"
          onClick={(e) => {
            e.preventDefault();
            scrollToGallery();
          }}
          whileHover={{
            scale: 1.05,
            boxShadow: "0 20px 40px rgba(255, 215, 0, 0.3)",
          }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-md overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500" />
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <span className="relative z-10 text-purple-900">Lihat Tema</span>
          <ArrowRight className="relative z-10 w-5 h-5 text-purple-900 group-hover:translate-x-1 transition-transform" />
        </motion.a>

        <motion.a
          href="#contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold text-sm sm:text-md border-2 border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/50 transition-all"
        >
          <span className="text-white">Konsultasi Gratis</span>
          <motion.span
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </motion.a>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.button
          onClick={scrollToGallery}
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white/90 transition-colors cursor-pointer"
          animate={{ y: [0, 10, 0] }}
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
