"use client";

import { motion } from "framer-motion";
import { JSX, useEffect, useState } from "react";

type Props = {
  quantity?: number;
  colorGlitter?: string;
  colorBokeh?: string;
};

export default function Particles({
  quantity = 60,
  colorGlitter = "rgba(255, 250, 240, 0.7)", // soft gold glitter
  colorBokeh = "rgba(255, 215, 160, 0.25)", // warm ivory bokeh
}: Props) {
  const [particles, setParticles] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const glitterParticles = Array.from({ length: quantity }).map((_, i) => {
      const size = Math.random() * 4 + 1; // 1px - 5px
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const dur = 1.5 + Math.random() * 2.5;
      const xMove = Math.random() * 20 - 10;
      const yMove = Math.random() * 20 - 10;
      const opa = 0.1 + Math.random() * 0.5;

      return (
        <motion.span
          key={`glitter-${i}`}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            background: colorGlitter,
            opacity: opa,
            filter: "blur(0.5px)",
          }}
          animate={{
            y: [0, yMove * 1.4, 0],
            x: [0, xMove * 1.4, 0],
            scale: [1, 1.15, 1],
            opacity: [opa, opa + 0.4, opa],
          }}
          transition={{
            duration: dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 3,
          }}
        />
      );
    });

    const bokehParticles = Array.from({ length: quantity / 3 }).map((_, i) => {
      const size = Math.random() * 80 + 40; // 40px - 120px
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const dur = 8 + Math.random() * 8;
      const opa = 0.05 + Math.random() * 0.15;

      return (
        <motion.span
          key={`bokeh-${i}`}
          className="absolute rounded-full pointer-events-none mix-blend-screen"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            background: colorBokeh,
            opacity: opa,
            filter: "blur(25px)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [opa, opa + 0.1, opa],
          }}
          transition={{
            duration: dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 6,
          }}
        />
      );
    });

    setParticles([...bokehParticles, ...glitterParticles]);
  }, [quantity, colorGlitter, colorBokeh]);

  return <>{particles}</>;
}
