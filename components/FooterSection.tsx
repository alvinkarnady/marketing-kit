"use client";

import {
  Instagram,
  Facebook,
  MessageCircle,
  Mail,
  Heart,
  ArrowUp,
  Phone,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export default function FooterSection() {
  const currentYear = new Date().getFullYear();
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://instagram.com/phinisikit",
      label: "Instagram",
      color: "from-pink-500 to-purple-500",
    },
    {
      icon: Facebook,
      href: "https://facebook.com/phinisikit",
      label: "Facebook",
      color: "from-blue-500 to-blue-600",
    },
    {
      icon: MessageCircle,
      href: "https://wa.me/6281248406898",
      label: "WhatsApp",
      color: "from-green-500 to-green-600",
    },
    {
      icon: Mail,
      href: "mailto:hello@phinisikit.com",
      label: "Email",
      color: "from-amber-500 to-yellow-500",
    },
  ];

  const navigation = [
    { name: "Beranda", href: "#home" },
    { name: "Galeri Tema", href: "#gallery" },
    { name: "Layanan", href: "#services" },
    { name: "Tentang", href: "#about" },
    { name: "Harga", href: "#pricing" },
    { name: "Kontak", href: "#contact" },
  ];

  const contactInfo = [
    { icon: Phone, text: "+62 812-4840-6898" },
    { icon: Mail, text: "hello@phinisikit.com" },
    { icon: MapPin, text: "Makassar, Indonesia" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-[#1a1a1a] via-[#2a2019] to-[#1a1a1a] text-white overflow-hidden">
      {/* Decorative background elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 to-yellow-500/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.1, 0.05],
        }}
        transition={{ duration: 12, repeat: Infinity, delay: 2 }}
        className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-amber-600/10 to-yellow-600/5 rounded-full blur-3xl"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-xl">P</span>
              </motion.div>
              <div>
                <h3 className="text-2xl font-bold">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-yellow-400">
                    Phinisi
                  </span>{" "}
                  <span className="text-white">Kit</span>
                </h3>
              </div>
            </div>

            <p className="text-white/70 leading-relaxed mb-6 max-w-md">
              Kami membantu Anda menciptakan pengalaman undangan digital yang
              elegan, modern, dan berkesan. Setiap detail dirancang dengan penuh
              perhatian untuk momen spesial Anda.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 text-white/60 hover:text-amber-400 transition-colors"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{info.text}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full" />
              Quick Links
            </h4>
            <ul className="space-y-3">
              {navigation.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <a
                    href={item.href}
                    className="text-white/60 hover:text-amber-400 transition-colors text-sm flex items-center gap-2 group"
                  >
                    <motion.span className="w-1 h-1 bg-amber-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    {item.name}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Social & Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-semibold mb-6 text-white flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full" />
              Connect With Us
            </h4>

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onHoverStart={() => setHoveredSocial(index)}
                    onHoverEnd={() => setHoveredSocial(null)}
                    whileHover={{ y: -5, scale: 1.05 }}
                    className="relative group"
                  >
                    <div className="flex items-center gap-2 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-amber-400/30 transition-all">
                      <div
                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${social.color} flex items-center justify-center`}
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-white/70 group-hover:text-amber-400 transition-colors">
                        {social.label}
                      </span>
                    </div>
                  </motion.a>
                );
              })}
            </div>

            <p className="text-white/50 text-xs leading-relaxed">
              Ikuti kami untuk update tema terbaru, tips & tricks undangan
              digital! ✨
            </p>
          </motion.div>
        </div>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-1 rounded-full">
              <Heart className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-sm text-white/50 text-center md:text-left"
          >
            © {currentYear} Phinisi Kit. Dibuat dengan{" "}
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block"
            >
              <Heart className="w-4 h-4 inline text-pink-400 mx-1" />
            </motion.span>
            di Makassar.
          </motion.p>

          {/* Back to Top Button */}
          <motion.button
            onClick={scrollToTop}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white rounded-full font-medium text-sm shadow-lg hover:shadow-xl transition-all group"
          >
            <span>Back to Top</span>
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowUp className="w-4 h-4" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
    </footer>
  );
}
