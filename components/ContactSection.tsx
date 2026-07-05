"use client";

import { motion } from "framer-motion";
import { useState } from "react";
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
      className="relative py-20 md:py-28 px-6 bg-white text-[#3b2a1a]"
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
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
              className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200 mb-4 sm:mb-6"
            >
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#b38b00]" />
              <span className="text-xs sm:text-sm font-medium text-[#7a5c2e]">
                Mari Terhubung
              </span>
            </motion.div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4af37] via-[#f4d03f] to-[#b38b00]">
                Tertarik
              </span>
              <br />
              <span className="text-[#3b2a1a]">Bekerja Sama?</span>
            </h2>

            <p className="text-[#6b5b45] leading-relaxed text-sm sm:text-base md:text-lg mb-6 md:mb-10">
              Hubungi kami untuk memesan tema undangan online impianmu, atau
              untuk kerjasama desain digital lainnya. Tim kami siap membantu!
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-3 sm:space-y-4">
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
                    className="flex items-center gap-3 sm:gap-4 p-3.5 sm:p-5 bg-white rounded-xl sm:rounded-2xl border border-amber-100 shadow-md hover:shadow-lg transition-all group"
                  >
                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm text-[#6b5b45]/70 font-medium">
                        {info.label}
                      </p>
                      <p className="text-sm sm:text-base text-[#3b2a1a] font-semibold truncate">
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
              <div className="bg-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8 shadow-md md:shadow-xl border border-amber-100">
                <div className="space-y-3.5 sm:space-y-5">
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
                      className="w-full p-3 pl-10 sm:p-4 sm:pl-12 text-sm sm:text-base rounded-lg sm:rounded-xl border border-amber-100 sm:border-2 focus:border-amber-400 outline-none transition-all bg-white"
                    />
                    <motion.div
                      animate={{
                        scale: focusedField === "name" ? 1.1 : 1,
                        rotate: focusedField === "name" ? 360 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-amber-500 text-base sm:text-xl"
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
                      className="w-full p-3 pl-10 sm:p-4 sm:pl-12 text-sm sm:text-base rounded-lg sm:rounded-xl border border-amber-100 sm:border-2 focus:border-amber-400 outline-none transition-all bg-white"
                    />
                    <motion.div
                      animate={{
                        scale: focusedField === "email" ? 1.1 : 1,
                        rotate: focusedField === "email" ? 360 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2"
                    >
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
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
                      rows={4}
                      whileFocus={{ scale: 1.01 }}
                      className="w-full p-3 pl-10 sm:p-4 sm:pl-12 text-sm sm:text-base rounded-lg sm:rounded-xl border border-amber-100 sm:border-2 focus:border-amber-400 outline-none transition-all resize-none bg-white min-h-[100px] sm:min-h-[120px]"
                    />
                    <motion.div
                      animate={{
                        scale: focusedField === "message" ? 1.1 : 1,
                        y: focusedField === "message" ? -2 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="absolute left-3 sm:left-4 top-3 sm:top-4"
                    >
                      <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
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
                    className={`relative w-full py-3 sm:py-4 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white shadow-lg sm:shadow-xl overflow-hidden transition-all ${
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
                            <CheckCircle2 className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                          </motion.div>
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Send className="w-[18px] h-[18px] sm:w-5 sm:h-5" />
                          Kirim via WhatsApp
                        </>
                      )}
                    </motion.span>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
