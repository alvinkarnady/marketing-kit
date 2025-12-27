"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { Users, Award, Heart, Sparkles, CheckCircle2 } from "lucide-react";

// Counter animation component
function AnimatedCounter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = target / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);

          return () => clearInterval(timer);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <span ref={ref} className="font-bold">
      {count}
      {suffix}
    </span>
  );
}

export default function AboutSection() {
  // Mouse parallax for image
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY, currentTarget } = e;
      const target = currentTarget as Window;
      const { innerWidth, innerHeight } = target;
      mouseX.set((clientX - innerWidth / 2) / 50);
      mouseY.set((clientY - innerHeight / 2) / 50);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const stats = [
    { icon: Users, value: 500, suffix: "+", label: "Pasangan Bahagia" },
    { icon: Award, value: 50, suffix: "+", label: "Tema Premium" },
    { icon: Heart, value: 100, suffix: "%", label: "Tingkat Kepuasan" },
  ];

  const benefits = [
    {
      icon: CheckCircle2,
      title: "Desain Eksklusif",
      desc: "Tema-tema kami dibuat oleh desainer profesional dengan cita rasa modern dan mewah.",
    },
    {
      icon: CheckCircle2,
      title: "Personalisasi Mudah",
      desc: "Sesuaikan undangan sesuai cerita dan gaya unik Anda tanpa ribet.",
    },
    {
      icon: CheckCircle2,
      title: "Pengalaman Premium",
      desc: "Tampilan, animasi, dan transisi yang halus memberi kesan eksklusif.",
    },
    {
      icon: CheckCircle2,
      title: "Support 24/7",
      desc: "Tim kami siap membantu Anda kapan saja untuk memastikan undangan sempurna.",
    },
  ];

  return (
    <section
      id="about"
      className="relative bg-gradient-to-b from-white via-amber-50/20 to-white text-[#3b2a1a] py-28 overflow-hidden"
    >
      {/* Animated background blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/30 to-yellow-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 3 }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tl from-yellow-200/20 to-amber-300/30 rounded-full blur-3xl"
      />

      <div className="container mx-auto px-6 md:px-12 lg:px-24">
        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative text-center"
              >
                <div className="inline-flex items-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-3 md:p-5 border border-amber-100 shadow-lg hover:shadow-xl transition-all duration-500">
                  {/* Icon with gradient background */}
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 text-white shadow-lg"
                  >
                    <Icon size={28} />
                  </motion.div>

                  <div className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] to-[#111110] ">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>
                  <p className="text-[#6b4e2f]/80 font-medium">{stat.label}</p>

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/0 via-yellow-400/0 to-amber-500/0 group-hover:from-amber-400/10 group-hover:via-yellow-400/5 group-hover:to-amber-500/10 rounded-2xl transition-all duration-500 pointer-events-none" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left Image */}
          <motion.div
            className="relative w-full lg:w-1/2"
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              style={{ x: smoothMouseX, y: smoothMouseY }}
              className="relative"
            >
              {/* Main image */}
              <div className="relative w-full h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/ring.jpg"
                  alt="Elegant wedding setup"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Floating decorative elements */}
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 5, 0],
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl opacity-80 blur-xl"
              />
              <motion.div
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -5, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-tl from-yellow-400 to-amber-500 rounded-full opacity-70 blur-2xl"
              />
            </motion.div>

            {/* Floating quote card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="absolute -bottom-8 -right-4 md:-right-8 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-3 md:p-8 border border-amber-100 max-w-xs"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div>
                  <p className="italic text-[#6b4e2f] text-xs md:text-sm leading-relaxed mb-1 md:mb-2">
                    "Every detail tells a story — we craft yours with elegance
                    and love."
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <motion.span
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="text-amber-400 text-xs md:text-sm"
                      >
                        ★
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 mb-6"
            >
              <Award className="w-4 h-4 text-amber-600" />
              <span className="text-xs sm:text-sm font-medium text-amber-800">
                Trusted by 500+ Couples
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#b38b00]">
                Mengapa Memilih
              </span>
              <br />
              <span className="text-[#3b2a1a]">Phinisi Kit?</span>
            </h2>

            <p className="text-[#6b4e2f]/80 leading-relaxed text-sm md:text-lg mb-8">
              Kami menghadirkan pengalaman pembuatan undangan digital yang tidak
              hanya indah, tapi juga penuh makna. Setiap elemen dirancang dengan
              rasa, gaya, dan sentuhan premium — mencerminkan kisah cinta yang
              elegan.
            </p>

            {/* Benefits List */}
            <div className="space-y-5 mb-10">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    className="flex items-start gap-4 group"
                  >
                    <div className="flex-shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md"
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </motion.div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#3b2a1a] mb-1 group-hover:text-[#d4af37] transition-colors">
                        {benefit.title}
                      </h4>
                      <p className="text-[#6b4e2f]/70 text-sm leading-relaxed">
                        {benefit.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#gallery"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(212, 175, 55, 0.3)",
                }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37] text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all"
              >
                Lihat Koleksi Tema
              </motion.a>

              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-amber-200 text-amber-800 rounded-xl font-semibold hover:border-amber-300 hover:bg-amber-50 transition-all shadow-md"
              >
                Hubungi Kami
              </motion.a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
