"use client";

import { motion, useAnimation, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  Crown,
  Sparkles,
  Flower2,
  ArrowRight,
  Check,
  Star,
  Zap,
  Award,
  Heart,
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, any> = {
  Star,
  Crown,
  Sparkles,
  Zap,
  Award,
  Heart,
  Flower2,
};

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  image: string | null;
  color: string;
  features: string[];
  buttonText: string;
  buttonLink: string | null;
  isActive: boolean;
  isFeatured: boolean;
  priority: number;
}

export default function ServicesSection() {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.15 });
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({
    enableFlipAnimation: true,
    autoRotate: false,
    autoRotateInterval: 5000,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef });
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  // Fetch services and settings
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch services
        const resServices = await fetch("/api/services?public=true");
        const servicesData = await resServices.json();
        setServices(servicesData || []);

        // Fetch settings
        const resSettings = await fetch("/api/services/settings");
        const settingsData = await resSettings.json();
        setSettings({
          enableFlipAnimation: settingsData.enableFlipAnimation ?? true,
          autoRotate: settingsData.autoRotate ?? false,
          autoRotateInterval: settingsData.autoRotateInterval ?? 5000,
        });
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Auto-rotate cards
  useEffect(() => {
    if (!settings.autoRotate || services.length === 0) return;

    const interval = setInterval(() => {
      setFlippedCard((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % services.length;
      });
    }, settings.autoRotateInterval);

    return () => clearInterval(interval);
  }, [settings.autoRotate, settings.autoRotateInterval, services.length]);

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Star;
  };

  // Don't render if no services
  if (!loading && services.length === 0) {
    return null;
  }

  return (
    <section
      id="services"
      ref={containerRef}
      className="relative bg-gradient-to-b from-white via-amber-50/30 to-white py-28 overflow-hidden"
    >
      {/* PARALLAX BACKGROUND */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-amber-200/30 to-yellow-300/20 rounded-full blur-[120px] opacity-70"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-yellow-300/20 to-amber-200/30 rounded-full blur-[140px] opacity-50"
      />

      {/* Floating decorative shapes */}
      <motion.div
        animate={{
          y: [0, -30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-40 right-20 w-20 h-20 border-2 border-amber-300/30 rounded-full"
      />
      <motion.div
        animate={{
          y: [0, 30, 0],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 25, repeat: Infinity }}
        className="absolute bottom-40 left-20 w-16 h-16 border-2 border-yellow-300/40 rounded-lg"
      />

      {/* Section Container */}
      <div
        ref={ref}
        className="relative container mx-auto px-6 md:px-12 lg:px-24 text-center"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, scale: 1 },
          }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 mb-6"
        >
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">
            Premium Services
          </span>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#b38b00]">
            Pilihan Tema
          </span>
          <br />
          <span className="text-[#3b2a1a]">untuk Hari Istimewa Anda</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-[#6b4e2f]/80 max-w-2xl mx-auto mb-16 text-lg"
        >
          Pilih tema undangan yang mencerminkan kisah cinta Anda. Semua tema
          kami dirancang dengan penuh rasa dan keindahan untuk menciptakan kesan
          pertama yang tak terlupakan.
        </motion.p>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent"></div>
          </div>
        )}

        {/* Cards Grid */}
        {!loading && services.length > 0 && (
          <div className="grid gap-10 md:grid-cols-3 relative z-10">
            {services.map((service, index) => {
              const Icon = getIconComponent(service.icon);
              const isFlipped =
                settings.enableFlipAnimation && flippedCard === index;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 70, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.15 }}
                  viewport={{ once: true }}
                  className="relative h-[520px]"
                  style={{ perspective: "1000px" }}
                >
                  <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full h-full"
                    style={{ transformStyle: "preserve-3d" }}
                    onHoverStart={() =>
                      settings.enableFlipAnimation && setFlippedCard(index)
                    }
                    onHoverEnd={() =>
                      settings.enableFlipAnimation &&
                      !settings.autoRotate &&
                      setFlippedCard(null)
                    }
                  >
                    {/* FRONT SIDE */}
                    <div
                      className="absolute inset-0 bg-white rounded-3xl overflow-hidden shadow-xl border border-amber-100"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      {/* Image */}
                      <div className="relative h-72 w-full overflow-hidden">
                        {service.image ? (
                          <Image
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform duration-[1200ms] group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                            <Icon className="w-20 h-20 text-gray-300" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Icon Badge */}
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          whileInView={{ scale: 1, rotate: 0 }}
                          transition={{
                            delay: 0.3 + index * 0.1,
                            duration: 0.6,
                          }}
                          viewport={{ once: true }}
                          className={`absolute top-6 left-6 w-12 h-12 rounded-xl bg-gradient-to-br ${service.color} shadow-lg flex items-center justify-center`}
                        >
                          <Icon className="w-6 h-6 text-white" />
                        </motion.div>

                        {/* Shimmer effect */}
                        <motion.div
                          initial={{ x: "-100%" }}
                          animate={{ x: isFlipped ? "100%" : "-100%" }}
                          transition={{ duration: 0.6 }}
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        />
                      </div>

                      {/* Content */}
                      <div className="relative p-6 text-left bg-gradient-to-b from-white to-amber-50/30">
                        <h3 className="text-2xl font-bold text-[#3b2a1a] mb-3 tracking-wide">
                          {service.title}
                        </h3>
                        <p className="text-[#6b4e2f]/80 leading-relaxed text-sm mb-4">
                          {service.description}
                        </p>

                        {/* Hover indicator */}
                        {settings.enableFlipAnimation && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: isFlipped ? 0 : 1 }}
                            className="flex items-center gap-2 text-amber-600 text-sm font-medium"
                          >
                            <span>Hover untuk detail</span>
                            <ArrowRight size={16} />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* BACK SIDE */}
                    {settings.enableFlipAnimation && (
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-white via-amber-50/50 to-yellow-50/30 rounded-3xl overflow-hidden shadow-xl border-2 border-amber-200"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <div className="relative h-full p-8 flex flex-col justify-between">
                          {/* Top gradient decoration */}
                          <div
                            className={`absolute top-0 left-0 right-0 h-full bg-gradient-to-b ${service.color} opacity-10 rounded-t-3xl`}
                          />

                          <div className="relative z-10">
                            {/* Icon */}
                            <div
                              className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} shadow-lg mb-6`}
                            >
                              <Icon className="w-7 h-7 text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-[#3b2a1a] mb-4">
                              {service.title}
                            </h3>

                            {/* Features List */}
                            <div className="space-y-2 mb-4">
                              {service.features.map((feature, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{
                                    opacity: isFlipped ? 1 : 0,
                                    x: isFlipped ? 0 : -20,
                                  }}
                                  transition={{ delay: i * 0.1 }}
                                  className="flex items-center gap-3"
                                >
                                  <div
                                    className={`w-4 h-4 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center flex-shrink-0`}
                                  >
                                    <Check className="w-3 h-3 text-white" />
                                  </div>
                                  <span className="text-[#6b4e2f] font-small text-sm">
                                    {feature}
                                  </span>
                                </motion.div>
                              ))}
                            </div>

                            <p className="text-[#6b4e2f]/70 text-sm leading-relaxed">
                              {service.description}
                            </p>
                          </div>

                          {/* CTA Button */}
                          <motion.a
                            href={service.buttonLink || "#contact"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{
                              opacity: isFlipped ? 1 : 0,
                              y: isFlipped ? 0 : 20,
                            }}
                            transition={{ delay: 0.3 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`relative w-full py-2 rounded-xl font-semibold text-white shadow-lg overflow-hidden group block text-center flex-shrink-0`}
                          >
                            <div
                              className={`absolute inset-0 bg-gradient-to-r ${service.color}`}
                            />
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {service.buttonText}
                              <ArrowRight size={18} />
                            </span>
                          </motion.a>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  {/* Glow effect */}
                  {settings.enableFlipAnimation && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isFlipped ? 1 : 0 }}
                      className={`absolute -inset-1 bg-gradient-to-r ${service.color} opacity-20 blur-xl rounded-3xl -z-10`}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-[#6b4e2f]/70 mb-6">
            Tidak yakin tema mana yang cocok? Konsultasi gratis dengan tim kami.
          </p>
          <motion.a
            href="#contact"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(212, 175, 55, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
          >
            Konsultasi Sekarang
            <ArrowRight size={20} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
