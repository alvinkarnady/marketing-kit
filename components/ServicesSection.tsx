"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  Sparkles,
  Flower2,
  ArrowRight,
  Check,
  Star,
  Zap,
  Award,
  Heart,
  Crown,
} from "lucide-react";

const iconMap: Record<string, typeof Star> = {
  Star,
  Crown,
  Sparkles,
  Zap,
  Award,
  Heart,
  Flower2,
};

const GOLD_CTA =
  "inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full font-semibold text-[#3b2a1a] bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] shadow-lg shadow-amber-200/60 hover:shadow-xl hover:shadow-amber-200/80 transition-shadow";

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

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const resServices = await fetch("/api/services?public=true");
        const servicesData = await resServices.json();
        setServices(servicesData || []);

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

  if (!loading && services.length === 0) {
    return null;
  }

  return (
    <section
      id="services"
      className="relative bg-gradient-to-b from-white via-amber-50/40 to-white py-20 md:py-28 overflow-hidden text-[#3b2a1a]"
    >
      <div className="absolute top-[-10%] left-[-5%] w-[420px] h-[420px] bg-gradient-to-br from-amber-200/25 to-yellow-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[420px] h-[420px] bg-gradient-to-tr from-amber-300/15 to-yellow-200/25 rounded-full blur-3xl pointer-events-none" />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={controls}
          variants={{ visible: { opacity: 1, scale: 1 } }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 mb-6"
        >
          <Sparkles className="w-4 h-4 text-[#b38b00]" />
          <span className="text-xs sm:text-sm font-medium text-[#7a5c2e]">
            Premium Services
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={controls}
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.8 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight"
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
          variants={{ visible: { opacity: 1, y: 0 } }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-[#6b5b45] max-w-2xl mx-auto mb-12 md:mb-16 text-sm sm:text-base md:text-lg"
        >
          Pilih tema undangan yang mencerminkan kisah cinta Anda. Semua tema
          kami dirancang dengan penuh rasa dan keindahan untuk menciptakan kesan
          pertama yang tak terlupakan.
        </motion.p>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent" />
          </div>
        )}

        {!loading && services.length > 0 && (
          <div className="grid gap-8 md:grid-cols-3">
            {services.map((service, index) => {
              const Icon = getIconComponent(service.icon);
              const isFlipped =
                settings.enableFlipAnimation && flippedCard === index;

              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative h-[480px]"
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
                    {/* Front */}
                    <div
                      className="absolute inset-0 bg-white rounded-2xl overflow-hidden shadow-md shadow-amber-100/50 border border-amber-100"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <div className="relative h-64 w-full overflow-hidden">
                        {service.image ? (
                          service.image.includes("cloudinary.com") ? (
                            <Image
                              src={service.image}
                              alt={service.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                              quality={85}
                              priority={index === 0}
                            />
                          ) : (
                            <img
                              src={service.image}
                              alt={service.title}
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : (
                          <div className="w-full h-full bg-amber-50 flex items-center justify-center">
                            <Icon className="w-16 h-16 text-amber-200" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                        <div className="absolute top-4 left-4 w-11 h-11 rounded-xl bg-amber-100 flex items-center justify-center">
                          <Icon className="w-5 h-5 text-[#b38b00]" />
                        </div>
                      </div>

                      <div className="relative p-5 text-left">
                        <h3 className="text-xl font-bold text-[#3b2a1a] mb-2">
                          {service.title}
                        </h3>
                        <p className="text-[#6b5b45] leading-relaxed text-sm mb-3 line-clamp-3">
                          {service.description}
                        </p>

                        {settings.enableFlipAnimation && (
                          <div className="flex items-center gap-2 text-[#7a5c2e] text-sm font-medium">
                            <span>Hover untuk detail</span>
                            <ArrowRight size={14} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Back */}
                    {settings.enableFlipAnimation && (
                      <div
                        className="absolute inset-0 bg-white rounded-2xl overflow-hidden shadow-md shadow-amber-100/50 border border-amber-100"
                        style={{
                          backfaceVisibility: "hidden",
                          WebkitBackfaceVisibility: "hidden",
                          transform: "rotateY(180deg)",
                        }}
                      >
                        <div className="relative h-full p-6 flex flex-col justify-between text-left">
                          <div>
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 mb-4">
                              <Icon className="w-6 h-6 text-[#b38b00]" />
                            </div>

                            <h3 className="text-lg font-bold text-[#3b2a1a] mb-3">
                              {service.title}
                            </h3>

                            <div className="space-y-2 mb-3">
                              {service.features.map((feature, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-2.5"
                                >
                                  <div className="w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                                    <Check className="w-2.5 h-2.5 text-amber-600" />
                                  </div>
                                  <span className="text-[#6b5b45] text-sm">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <p className="text-[#6b5b45] text-sm leading-relaxed line-clamp-2">
                              {service.description}
                            </p>
                          </div>

                          <motion.a
                            href={service.buttonLink || "#contact"}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            className={`${GOLD_CTA} w-full py-3 mt-4 text-sm`}
                          >
                            {service.buttonText}
                            <ArrowRight size={16} />
                          </motion.a>
                        </div>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 text-center"
        >
          <p className="text-[#6b5b45] mb-6 text-sm md:text-base">
            Tidak yakin tema mana yang cocok? Konsultasi gratis dengan tim kami.
          </p>
          <motion.a
            href="#contact"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={GOLD_CTA}
          >
            Konsultasi Sekarang
            <ArrowRight size={18} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
