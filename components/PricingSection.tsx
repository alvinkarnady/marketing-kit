"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Crown,
  Sparkles,
  Star,
  Zap,
  Award,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";

// Icon mapping
const iconMap: Record<string, any> = {
  Star,
  Crown,
  Sparkles,
  Zap,
  Award,
  Heart,
};

interface PricingPlan {
  id: number;
  name: string;
  subtitle: string;
  price: number;
  currentPrice?: number;
  originalPrice?: number | null;
  hasDiscount?: boolean;
  period: string;
  features: string[];
  isActive: boolean;
  isHighlight: boolean;
  isPopular: boolean;
  priority: number;
  icon: string;
  gradient: string;
  buttonStyle: string;
  whatsappMessage?: string | null;
}

export default function PricingSection() {
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [whatsappNumber, setWhatsappNumber] = useState("6281248406898");

  // Fetch pricing plans and settings
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        // Fetch plans
        const resPlans = await fetch("/api/pricing?public=true");
        const plansData = await resPlans.json();
        setPlans(plansData || []);

        // Fetch settings
        const resSettings = await fetch("/api/pricing/settings");
        const settingsData = await resSettings.json();
        setWhatsappNumber(settingsData.whatsappNumber || "6281248406898");
      } catch (error) {
        console.error("Failed to fetch pricing data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const getWhatsAppLink = (plan: PricingPlan) => {
    const price = plan.hasDiscount ? plan.currentPrice : plan.price;
    const message =
      plan.whatsappMessage ||
      `Halo, saya tertarik dengan paket "${
        plan.name
      }" seharga Rp ${price?.toLocaleString("id-ID")}. Bisa info lebih lanjut?`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
      message
    )}`;
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Star;
  };

  // Don't render if no plans
  if (!loading && plans.length === 0) {
    return null;
  }

  // Determine grid columns based on number of plans
  const getGridClass = () => {
    if (plans.length === 1) return "grid-cols-1 max-w-md mx-auto";
    if (plans.length === 2)
      return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto";
    return "grid-cols-1 md:grid-cols-3";
  };

  return (
    <section
      id="pricing"
      className="relative py-28 px-6 bg-gradient-to-b from-white via-amber-50/30 to-white overflow-hidden"
    >
      {/* Animated background elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-yellow-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        className="absolute bottom-20 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-200/20 to-amber-300/30 rounded-full blur-3xl"
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto text-center relative z-10"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 mb-6"
        >
          <Zap className="w-4 h-4 text-amber-600" />
          <span className="text-sm font-medium text-amber-800">
            Paket Terjangkau
          </span>
        </motion.div>

        {/* Heading */}
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#b38b00]">
            Pilih Paket
          </span>
          <br />
          <span className="text-[#3b2a1a]">Undanganmu</span>
        </h2>

        <p className="text-[#6b4e2f]/80 mb-16 max-w-2xl mx-auto text-lg">
          Sesuaikan kebutuhanmu — mulai dari paket sederhana hingga desain
          eksklusif dengan fitur premium.
        </p>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent"></div>
          </div>
        )}

        {/* Pricing Cards - CENTERED GRID */}
        {!loading && plans.length > 0 && (
          <div className={`grid ${getGridClass()} gap-8 items-stretch`}>
            {plans.map((plan, index) => {
              const Icon = getIconComponent(plan.icon);
              const isHovered = hoveredIndex === index;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  viewport={{ once: true }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className={`relative p-8 rounded-3xl border-2 transition-all duration-500 ${
                    plan.isHighlight
                      ? `bg-gradient-to-br ${plan.gradient} text-white border-transparent shadow-2xl scale-105 md:scale-110`
                      : "bg-white/80 backdrop-blur-sm border-amber-100 shadow-lg hover:shadow-xl"
                  }`}
                >
                  {/* Popular Badge */}
                  {plan.isPopular && (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1"
                    >
                      <Crown size={14} />
                      PALING POPULER
                    </motion.div>
                  )}

                  {/* Discount Badge */}
                  {plan.hasDiscount && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg"
                    >
                      DISKON!
                    </motion.div>
                  )}

                  {/* Icon */}
                  <motion.div
                    animate={
                      isHovered
                        ? { rotate: 360, scale: 1.1 }
                        : { rotate: 0, scale: 1 }
                    }
                    transition={{ duration: 0.6 }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg ${
                      plan.isHighlight
                        ? "bg-white/20 backdrop-blur-sm"
                        : `bg-gradient-to-br ${plan.gradient}`
                    }`}
                  >
                    <Icon
                      className={`w-8 h-8 ${
                        plan.isHighlight ? "text-white" : "text-white"
                      }`}
                    />
                  </motion.div>

                  {/* Plan Name */}
                  <h3
                    className={`text-3xl font-bold mb-2 ${
                      plan.isHighlight ? "text-white" : "text-[#3b2a1a]"
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm mb-6 ${
                      plan.isHighlight ? "text-white/90" : "text-[#6b4e2f]/70"
                    }`}
                  >
                    {plan.subtitle}
                  </p>

                  {/* Price */}
                  <div className="mb-8">
                    {plan.hasDiscount ? (
                      <>
                        <div className="flex items-baseline justify-center gap-1 mb-1">
                          <span
                            className={`text-2xl font-semibold line-through opacity-60 ${
                              plan.isHighlight
                                ? "text-white/70"
                                : "text-[#6b4e2f]/50"
                            }`}
                          >
                            Rp {plan.originalPrice?.toLocaleString("id-ID")}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-center gap-1">
                          <span
                            className={`text-2xl font-semibold ${
                              plan.isHighlight
                                ? "text-white/90"
                                : "text-purple-600"
                            }`}
                          >
                            Rp
                          </span>
                          <motion.span
                            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                            className={`text-5xl font-bold ${
                              plan.isHighlight
                                ? "text-white"
                                : "text-purple-600"
                            }`}
                          >
                            {plan.currentPrice?.toLocaleString("id-ID")}
                          </motion.span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-baseline justify-center gap-1">
                        <span
                          className={`text-2xl font-semibold ${
                            plan.isHighlight
                              ? "text-white/90"
                              : "text-[#6b4e2f]"
                          }`}
                        >
                          Rp
                        </span>
                        <motion.span
                          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
                          className={`text-5xl font-bold ${
                            plan.isHighlight
                              ? "text-white"
                              : "bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] to-[#b38b00]"
                          }`}
                        >
                          {plan.price.toLocaleString("id-ID")}
                        </motion.span>
                      </div>
                    )}
                    <p
                      className={`text-sm mt-1 ${
                        plan.isHighlight ? "text-white/80" : "text-[#6b4e2f]/60"
                      }`}
                    >
                      {plan.period}
                    </p>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-4 mb-8 text-left">
                    {plan.features.map((feat, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        viewport={{ once: true }}
                        className={`flex items-start gap-3 ${
                          plan.isHighlight ? "text-white" : "text-[#6b4e2f]"
                        }`}
                      >
                        <CheckCircle2
                          size={20}
                          className={`flex-shrink-0 mt-0.5 ${
                            plan.isHighlight ? "text-white" : "text-amber-500"
                          }`}
                        />
                        <span className="text-sm font-medium">{feat}</span>
                      </motion.li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <motion.a
                    href={getWhatsAppLink(plan)}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`block w-full text-center py-4 rounded-xl font-semibold transition-all shadow-lg ${plan.buttonStyle}`}
                  >
                    Pesan Sekarang
                  </motion.a>

                  {/* Glow effect on hover */}
                  {!plan.isHighlight && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isHovered ? 1 : 0 }}
                      className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-yellow-500 opacity-20 blur-xl rounded-3xl -z-10"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Bottom Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-[#6b4e2f]/70 mb-6">
            Butuh paket custom atau konsultasi? Hubungi kami untuk penawaran
            spesial!
          </p>
          <motion.a
            href={`https://wa.me/${whatsappNumber}?text=Halo,%20saya%20ingin%20konsultasi%20paket%20custom`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-amber-200 text-amber-800 rounded-xl font-semibold hover:border-amber-300 hover:bg-amber-50 transition-all shadow-md"
          >
            <Sparkles size={20} />
            Konsultasi Paket Custom
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
