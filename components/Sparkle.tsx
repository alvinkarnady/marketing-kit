"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type SparkleProps = {
  interval?: number; // durasi munculnya sparkle baru
  color?: string;
};

export default function Sparkle({
  interval = 2000,
  color = "rgba(255, 230, 150, 0.9)", // gold soft sparkle
}: SparkleProps) {
  const [sparkles, setSparkles] = useState<
    { id: number; x: number; y: number; size: number }[]
  >([]);

  useEffect(() => {
    const addSparkle = () => {
      const newSparkle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
      };
      setSparkles((prev) => [...prev.slice(-10), newSparkle]); // simpan maksimal 10 sparkle
    };

    const timer = setInterval(addSparkle, interval);
    return () => clearInterval(timer);
  }, [interval]);

  return (
    <>
      {sparkles.map((sparkle) => (
        <motion.span
          key={sparkle.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            top: `${sparkle.y}%`,
            left: `${sparkle.x}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            background: color,
            filter: "blur(1px)",
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: [0, 1.4, 0], opacity: [0, 1, 0] }}
          transition={{
            duration: 2.5,
            ease: "easeOut",
          }}
        />
      ))}
    </>
  );
}
