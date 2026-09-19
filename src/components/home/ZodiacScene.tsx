"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * Single Surya zodiac-wheel artwork: idle spin layered with scroll-driven
 * circular rotation and a gentle float — one image, no stacked layers.
 */
export default function ZodiacScene() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 55, damping: 18, mass: 0.5 });
  // scroll moves the wheel around the circle (±90°)
  const scrollSpin = useTransform(p, [0, 1], [-90, 90]);
  const floatY = useTransform(p, [0, 0.5, 1], [26, -26, 26]);
  const tilt = useTransform(p, [0, 0.5, 1], [7, 0, -7]);

  return (
    <div ref={ref} className="relative h-full w-full" style={{ perspective: "1200px" }}>
      {/* breathing aura behind the wheel */}
      <div
        className="pointer-events-none absolute inset-[4%] rounded-full bg-[radial-gradient(circle,rgba(255,183,0,0.5)_0%,rgba(168,85,247,0.3)_45%,transparent_72%)] blur-[38px]"
        style={{ animation: "sun-breathe 6s ease-in-out infinite" }}
      />

      {/* float + 3D tilt as the visitor scrolls past */}
      <motion.div style={{ y: floatY, rotateX: tilt }} className="absolute inset-0">
        {/* idle slow spin (never stops) */}
        <motion.div
          className="absolute inset-[4%]"
          animate={{ rotate: 360 }}
          transition={{ duration: 70, repeat: Infinity, ease: "linear" }}
        >
          {/* extra circular movement driven by scroll */}
          <motion.div style={{ rotate: scrollSpin }} className="absolute inset-0">
            <div className="relative aspect-square w-full overflow-hidden rounded-full shadow-[0_0_90px_-12px_rgba(245,194,66,0.65)]">
              <Image
                src="/images/zodiac-wheel.png"
                alt="Rashi Chakra"
                fill
                sizes="(max-width: 768px) 92vw, 520px"
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* soft vignette so it melts into the page background */}
      <div className="pointer-events-none absolute inset-0 rounded-full bg-[radial-gradient(circle,transparent_58%,rgba(5,2,16,0.85)_88%)]" />
    </div>
  );
}
