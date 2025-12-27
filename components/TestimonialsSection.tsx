"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { useEffect, useState } from "react";

interface Theme {
  id: number;
  name: string;
}

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string | null;
  rating: number;
  text: string;
  event: string;
  theme?: Theme;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Fetch testimonials from API
  useEffect(() => {
    async function fetchTestimonials() {
      try {
        setLoading(true);
        const res = await fetch("/api/testimonials?public=true");
        const data = await res.json();
        setTestimonials(data || []);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonials();
  }, []);

  // Duplicate testimonials for seamless infinite scroll
  const duplicatedTestimonials =
    testimonials.length < 2 ? [...testimonials, ...testimonials] : [];

  // Don't render if no testimonials
  if (!loading && testimonials.length === 0) {
    return null;
  }

  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-white via-amber-50/30 to-white">
      {/* Background decorations */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-20 left-0 w-96 h-96 bg-gradient-to-br from-amber-200/20 to-yellow-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        className="absolute bottom-20 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-200/20 to-amber-300/20 rounded-full blur-3xl"
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-16 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 mb-6"
          >
            <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
            <span className="text-xs sm:text-sm font-medium text-amber-800">
              Testimoni Pelanggan
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6"
          >
            <span className="text-[#3b2a1a]">Cerita dari</span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#b38b00]">
              Pasangan Bahagia
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="text-[#6b4e2f]/80 max-w-2xl mx-auto text-sm md:text-lg"
          >
            Bergabunglah dengan ratusan pasangan yang telah mempercayai kami
            untuk menciptakan undangan digital mereka yang sempurna.
          </motion.p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-amber-600 border-r-transparent"></div>
          </div>
        )}

        {/* Infinite Scroll Container */}
        {!loading && testimonials.length > 0 && (
          <div className="relative">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 md:w-32 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />

            {/* Scrolling Container */}
            <motion.div
              className="flex gap-4 md:gap-6"
              animate={{
                x: isPaused ? [0, 1000] : [0, -1000],
              }}
              transition={{
                x: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
              onHoverStart={() => setIsPaused(true)}
              onHoverEnd={() => setIsPaused(false)}
            >
              {duplicatedTestimonials.map((testimonial, index) => (
                <motion.div
                  key={`${testimonial.id}-${index}`}
                  whileHover={{ scale: 1.05, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 w-[280px] sm:w-[340px] md:w-[380px] lg:w-[400px] bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 shadow-xl border border-amber-100 hover:shadow-2xl hover:border-amber-200 transition-all relative group"
                >
                  {/* Quote Icon */}
                  <div className="absolute top-4 md:top-6 right-4 md:right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Quote className="w-12 h-12 md:w-16 md:h-16 text-amber-500" />
                  </div>

                  {/* Client Info */}
                  <div className="flex items-center gap-4 mb-6 relative z-10">
                    <div className="relative flex-shrink-0">
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-3 border-amber-200 shadow-lg">
                        {testimonial.image ? (
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center">
                            <span className="text-3xl md:text-4xl font-bold text-amber-700">
                              {testimonial.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      {/* Online indicator */}
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-br from-green-400 to-green-500 rounded-full border-3 border-white shadow-md" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#3b2a1a] text-base md:text-lg truncate">
                        {testimonial.name}
                      </h4>
                      <p className="text-xs md:text-sm text-[#6b4e2f]/60">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3 md:mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-400 fill-amber-400" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <p className="text-[#6b4e2f] leading-relaxed mb-4 md:mb-6 relative z-10 text-xs md:text-sm">
                    "{testimonial.text}"
                  </p>

                  {/* Event Info & Theme */}
                  <div className="flex flex-wrap items-center gap-2 text-xs md:text-sm">
                    <div className="px-2.5 md:px-3 py-1 bg-amber-100/80 text-amber-800 rounded-full font-medium">
                      {testimonial.event}
                    </div>
                    {testimonial.theme && (
                      <div className="px-2.5 md:px-3 py-1 bg-blue-100/80 text-blue-800 rounded-full font-medium">
                        {testimonial.theme.name}
                      </div>
                    )}
                  </div>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-amber-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl pointer-events-none" />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16 px-6"
        >
          <p className="text-[#6b4e2f]/70 mb-6 text-sm">
            Siap menjadi bagian dari cerita sukses kami?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="#gallery"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 20px 40px rgba(212, 175, 55, 0.3)",
              }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
            >
              Lihat Tema
            </motion.a>

            <motion.a
              href="/submit-testimonial"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-amber-200 text-amber-800 rounded-xl font-semibold hover:bg-amber-50 transition-all"
            >
              Kirim Testimoni Anda
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
