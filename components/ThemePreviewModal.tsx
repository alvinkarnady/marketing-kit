"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useEffect } from "react";

interface Category {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

interface Theme {
  id: number;
  name: string;
  price: number;
  image: string | null;
  demoUrl: string;
  categoryId: number;
  category: Category;
}

type Props = {
  isOpen: boolean;
  selected: Theme | null;
  onClose: () => void;
};

export default function ThemePreviewModal({
  isOpen,
  selected,
  onClose,
}: Props) {
  // Scroll lock when modal open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [isOpen]);

  const { scrollYProgress } = useScroll();
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -20]);
  const tabletY = useTransform(scrollYProgress, [0, 1], [0, -35]);
  const laptopY = useTransform(scrollYProgress, [0, 1], [0, -50]);

  return (
    <AnimatePresence>
      {isOpen && selected && (
        <motion.div
          className="fixed inset-0 z-[999] flex items-center justify-center px-6 backdrop-blur-xl bg-black/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-[9999] p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"
          >
            <X size={22} className="text-white" />
          </button>

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative bg-white/5 backdrop-blur-2xl border border-white/10 
                       rounded-3xl shadow-2xl p-8 max-w-4xl w-full text-center
                       overflow-hidden"
          >
            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white text-3xl font-bold mb-2"
            >
              {selected.name}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/80 mb-2 tracking-wide"
            >
              {selected.category.name}
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-white/90 font-semibold text-xl mb-10"
            >
              Rp {selected.price.toLocaleString("id-ID")}
            </motion.p>

            {/* === 3 Devices Floating Showcase === */}
            <div className="relative w-full flex justify-center items-center h-[480px] md:h-[520px]">
              {/* Laptop */}
              {selected.image && (
                <motion.div
                  style={{ y: laptopY }}
                  whileHover={{ rotate: -2, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 80 }}
                  className="absolute -left-6 md:-left-24 top-20 w-[250px] md:w-[340px] 
                           h-[150px] md:h-[210px] rounded-xl overflow-hidden border-[3px]
                           border-neutral-900 bg-black shadow-2xl hidden md:block"
                >
                  <Image
                    src={selected.image}
                    alt="Laptop Preview"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 w-full h-3 bg-neutral-800" />
                </motion.div>
              )}

              {/* Tablet */}
              {selected.image && (
                <motion.div
                  style={{ y: tabletY }}
                  whileHover={{ rotate: 2, scale: 1.04 }}
                  transition={{ type: "spring", stiffness: 80 }}
                  className="absolute right-0 md:-right-20 top-28 w-[170px] md:w-[230px] 
                           h-[240px] md:h-[340px] rounded-3xl overflow-hidden 
                           border-[4px] border-neutral-900 bg-black shadow-2xl"
                >
                  <Image
                    src={selected.image}
                    alt="Tablet Preview"
                    fill
                    className="object-cover"
                  />
                </motion.div>
              )}

              {/* Phone */}
              {selected.image ? (
                <motion.div
                  style={{ y: phoneY }}
                  whileHover={{ rotate: 3, scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 110 }}
                  className="relative z-20 w-[230px] h-[470px] rounded-[35px] border-[4px] 
                           border-neutral-900 bg-black overflow-hidden shadow-2xl"
                >
                  <Image
                    src={selected.image}
                    alt="Phone Preview"
                    fill
                    className="object-cover"
                  />

                  {/* Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-black rounded-b-2xl opacity-70" />

                  {/* Soft reflection */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent mix-blend-overlay" />
                </motion.div>
              ) : (
                <div
                  className="relative z-20 w-[230px] h-[470px] rounded-[35px] border-[4px] 
                             border-neutral-900 bg-gradient-to-br from-neutral-800 to-neutral-900 
                             overflow-hidden shadow-2xl flex items-center justify-center"
                >
                  <span className="text-white/50">No Preview</span>
                </div>
              )}
            </div>

            {/* CTA BUTTONS */}
            <div className="flex gap-4 justify-center mt-10">
              {selected.demoUrl && (
                <motion.a
                  href={selected.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="px-8 py-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20
                           text-white font-semibold shadow-lg hover:bg-white/20 transition-all"
                >
                  Lihat Demo
                </motion.a>
              )}

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-[#d4af37] to-[#b38b00]
                         text-white font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                Gunakan Tema Ini
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
