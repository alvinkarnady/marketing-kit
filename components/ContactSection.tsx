"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Send,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  CheckCircle2,
} from "lucide-react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Mouse parallax
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { name, email, message } = form;

    if (!name || !email || !message) {
      alert("Mohon lengkapi semua field");
      return;
    }

    const phone = "6281248406898";
    const text = `Halo, saya ${name}.\nEmail: ${email}\n\nPesan:\n${message}`;
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

    setIsSubmitted(true);
    setTimeout(() => {
      window.open(url, "_blank");
      setForm({ name: "", email: "", message: "" });
      setIsSubmitted(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: Phone,
      label: "WhatsApp",
      value: "+62 812-4840-6898",
      link: "https://wa.me/6281248406898",
    },
    {
      icon: Mail,
      label: "Email",
      value: "hello@phinisikit.com",
      link: "mailto:hello@phinisikit.com",
    },
    {
      icon: MapPin,
      label: "Lokasi",
      value: "Makassar, Indonesia",
      link: "#",
    },
  ];

  return (
    <section
      id="contact"
      className="relative py-28 px-6 bg-gradient-to-br from-amber-50 via-white to-yellow-50 overflow-hidden"
    >
      {/* Animated background */}
      <motion.div
        style={{ x: smoothMouseX, y: smoothMouseY }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-200/30 to-yellow-300/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tl from-yellow-200/20 to-amber-300/30 rounded-full blur-3xl"
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
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
              <MessageCircle className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-medium text-amber-800">
                Mari Terhubung
              </span>
            </motion.div>

            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#b38b00]">
                Tertarik
              </span>
              <br />
              <span className="text-[#3b2a1a]">Bekerja Sama?</span>
            </h2>

            <p className="text-[#6b4e2f]/80 leading-relaxed text-lg mb-10">
              Hubungi kami untuk memesan tema undangan online impianmu, atau
              untuk kerjasama desain digital lainnya. Tim kami siap membantu!
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.a
                    key={index}
                    href={info.link}
                    target={info.link.startsWith("http") ? "_blank" : undefined}
                    rel={
                      info.link.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5, scale: 1.02 }}
                    className="flex items-center gap-4 p-5 bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-100 shadow-md hover:shadow-lg transition-all group"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-[#6b4e2f]/60 font-medium">
                        {info.label}
                      </p>
                      <p className="text-[#3b2a1a] font-semibold">
                        {info.value}
                      </p>
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              {/* Form Card */}
              <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-amber-100">
                <div className="space-y-5">
                  {/* Name Input */}
                  <div className="relative">
                    <motion.input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Nama Lengkap"
                      whileFocus={{ scale: 1.01 }}
                      className="w-full p-4 pl-12 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none transition-all bg-white"
                    />
                    <motion.div
                      animate={{
                        scale: focusedField === "name" ? 1.1 : 1,
                        rotate: focusedField === "name" ? 360 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 text-xl"
                    >
                      👤
                    </motion.div>
                  </div>

                  {/* Email Input */}
                  <div className="relative">
                    <motion.input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Alamat Email"
                      whileFocus={{ scale: 1.01 }}
                      className="w-full p-4 pl-12 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none transition-all bg-white"
                    />
                    <motion.div
                      animate={{
                        scale: focusedField === "email" ? 1.1 : 1,
                        rotate: focusedField === "email" ? 360 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2"
                    >
                      <Mail className="w-5 h-5 text-amber-500" />
                    </motion.div>
                  </div>

                  {/* Message Textarea */}
                  <div className="relative">
                    <motion.textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("message")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="Tulis pesan Anda di sini..."
                      rows={5}
                      whileFocus={{ scale: 1.01 }}
                      className="w-full p-4 pl-12 rounded-xl border-2 border-amber-100 focus:border-amber-400 outline-none transition-all resize-none bg-white"
                    />
                    <motion.div
                      animate={{
                        scale: focusedField === "message" ? 1.1 : 1,
                        y: focusedField === "message" ? -2 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-4 top-4"
                    >
                      <MessageCircle className="w-5 h-5 text-amber-500" />
                    </motion.div>
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitted}
                    whileHover={{
                      scale: isSubmitted ? 1 : 1.02,
                      boxShadow: "0 20px 40px rgba(212, 175, 55, 0.3)",
                    }}
                    whileTap={{ scale: isSubmitted ? 1 : 0.98 }}
                    className={`relative w-full py-4 rounded-xl font-semibold text-white shadow-xl overflow-hidden transition-all ${
                      isSubmitted ? "cursor-not-allowed" : ""
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#d4af37]" />
                    <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity" />

                    <motion.span
                      className="relative z-10 flex items-center justify-center gap-2"
                      animate={isSubmitted ? { scale: [1, 1.1, 1] } : {}}
                      transition={{
                        duration: 0.3,
                        repeat: isSubmitted ? Infinity : 0,
                      }}
                    >
                      {isSubmitted ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <CheckCircle2 size={20} />
                          </motion.div>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send size={20} />
                          Kirim via WhatsApp
                        </>
                      )}
                    </motion.span>
                  </motion.button>
                </div>
              </div>

              {/* Decorative elements */}
              <motion.div
                animate={{
                  rotate: 360,
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full blur-2xl pointer-events-none"
              />
              <motion.div
                animate={{
                  rotate: -360,
                  scale: [1, 1.2, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-tl from-yellow-400/20 to-amber-500/20 rounded-full blur-2xl pointer-events-none"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
