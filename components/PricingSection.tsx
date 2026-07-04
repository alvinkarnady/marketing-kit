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

const iconMap: Record<string, typeof Star> = {
  Star,
  Crown,
  Sparkles,
  Zap,
  Award,
  Heart,
};

const GOLD_CTA =
  "block w-full text-center py-3.5 rounded-full font-semibold text-[#3b2a1a] bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] shadow-lg shadow-amber-200/60 hover:shadow-xl hover:shadow-amber-200/80 transition-shadow";

const OUTLINE_CTA =
  "block w-full text-center py-3.5 rounded-full font-semibold border-2 border-amber-300 text-[#3b2a1a] bg-white/60 hover:bg-amber-50 hover:border-amber-400 transition-colors";

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
  const [whatsappNumber, setWhatsappNumber] = useState("6281248406898");
  const [showPrice, setShowPrice] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const resPlans = await fetch("/api/pricing?public=true");
        const plansData = await resPlans.json();
        setPlans(plansData || []);

        const resSettings = await fetch("/api/pricing/settings");
        const settingsData = await resSettings.json();
        setWhatsappNumber(settingsData.whatsappNumber || "6281248406898");
        if (settingsData && settingsData.showPrice !== undefined) {
          setShowPrice(settingsData.showPrice);
        }
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
      message,
    )}`;
  };

  const getIconComponent = (iconName: string) => {
    return iconMap[iconName] || Star;
  };

  if (!loading && plans.length === 0) {
    return null;
  }

  const getGridClass = () => {
    if (plans.length === 1) return "grid-cols-1 max-w-md mx-auto";
    if (plans.length === 2)
      return "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto";
    return "grid-cols-1 md:grid-cols-3";
  };

  return (
    <section
      id="pricing"
      className="relative py-20 md:py-28 px-6 bg-gradient-to-b from-white via-amber-50/40 to-white overflow-hidden text-[#3b2a1a]"
    >
      <div className="absolute top-[-10%] right-[-5%] w-[420px] h-[420px] bg-gradient-to-br from-amber-200/25 to-yellow-300/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[420px] h-[420px] bg-gradient-to-tr from-amber-300/15 to-yellow-200/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 mb-6"
        >
          <Zap className="w-4 h-4 text-[#b38b00]" />
          <span className="text-xs sm:text-sm font-medium text-[#7a5c2e]">
            Paket Terjangkau
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#b38b00]">
            Pilih Paket
          </span>
          <br />
          <span className="text-[#3b2a1a]">Undanganmu</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          viewport={{ once: true }}
          className="text-[#6b5b45] mb-12 md:mb-16 max-w-2xl mx-auto text-sm sm:text-base md:text-lg"
        >
          Sesuaikan kebutuhanmu — mulai dari paket sederhana hingga desain
          eksklusif dengan fitur premium.
        </motion.p>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent" />
          </div>
        )}

        {!loading && plans.length > 0 && (
          <div className={`grid ${getGridClass()} gap-6 md:gap-8 items-stretch`}>
            {plans.map((plan, index) => {
              const Icon = getIconComponent(plan.icon);
              const isHighlight = plan.isHighlight || plan.isPopular;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -4 }}
                  className={`relative p-6 md:p-8 rounded-2xl border transition-all duration-300 bg-white shadow-md shadow-amber-100/50 ${
                    isHighlight
                      ? "border-amber-300 ring-1 ring-amber-200/80 bg-amber-50/30"
                      : "border-amber-100"
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-100 text-[#7a5c2e] border border-amber-200 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap">
                      <Crown size={13} className="text-[#b38b00]" />
                      Paling Populer
                    </div>
                  )}

                  {plan.hasDiscount && (
                    <div className="absolute -top-2 -right-2 bg-amber-200/90 text-[#7a5c2e] text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-300">
                      Diskon
                    </div>
                  )}

                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-amber-100 mb-5">
                    <Icon className="w-6 h-6 text-[#b38b00]" />
                  </div>

                  <h3 className="text-2xl font-bold mb-1 text-[#3b2a1a]">
                    {plan.name}
                  </h3>
                  <p className="text-sm mb-6 text-[#6b5b45]">{plan.subtitle}</p>

                  {showPrice && (
                    <div className="mb-6">
                      {plan.hasDiscount ? (
                        <>
                          <p className="text-sm line-through text-[#6b5b45]/50 mb-1">
                            Rp {plan.originalPrice?.toLocaleString("id-ID")}
                          </p>
                          <div className="flex items-baseline justify-center gap-1">
                            <span className="text-lg font-semibold text-[#6b5b45]">
                              Rp
                            </span>
                            <span className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] to-[#b38b00]">
                              {plan.currentPrice?.toLocaleString("id-ID")}
                            </span>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-lg font-semibold text-[#6b5b45]">
                            Rp
                          </span>
                          <span className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] to-[#b38b00]">
                            {plan.price.toLocaleString("id-ID")}
                          </span>
                        </div>
                      )}
                      <p className="text-sm mt-1 text-[#6b5b45]/70">
                        {plan.period}
                      </p>
                    </div>
                  )}

                  <ul className="space-y-3 mb-8 text-left">
                    {plan.features.map((feat, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-[#6b5b45]"
                      >
                        <CheckCircle2
                          size={18}
                          className="shrink-0 mt-0.5 text-amber-500"
                        />
                        <span className="text-sm">{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.a
                    href={getWhatsAppLink(plan)}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={isHighlight ? GOLD_CTA : OUTLINE_CTA}
                  >
                    Pesan Sekarang
                  </motion.a>
                </motion.div>
              );
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 text-center"
        >
          <p className="text-[#6b5b45] mb-6 text-sm md:text-base">
            Butuh paket custom atau konsultasi? Hubungi kami untuk penawaran
            spesial!
          </p>
          <motion.a
            href={`https://wa.me/${whatsappNumber}?text=Halo,%20saya%20ingin%20konsultasi%20paket%20custom`}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold border-2 border-amber-300 text-[#3b2a1a] bg-white/60 hover:bg-amber-50 hover:border-amber-400 transition-colors"
          >
            <Sparkles size={18} className="text-[#b38b00]" />
            Konsultasi Paket Custom
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
