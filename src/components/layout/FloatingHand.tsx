"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

/**
 * A glowing palm that floats down the page in a zig-zag path as the visitor scrolls.
 * The image has a pure-black background which is removed via mix-blend-screen on the
 * (non-isolated) motion container, so only the luminous hand + a soft white/gold aura
 * are visible over the page — no rectangular card, no border.
 */
export default function FloatingHand() {
  const pathname = usePathname();
  const show = !pathname.startsWith("/dashboard") && !pathname.startsWith("/login") && !pathname.startsWith("/register");
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 60, damping: 20, mass: 0.6 });
  if (!show) return null;

  const top = useTransform(p, [0, 1], ["10vh", "70vh"]);
  const left = useTransform(p, (v) => `${50 + Math.sin(v * Math.PI * 4) * 38}%`);
  const rotate = useTransform(p, (v) => Math.sin(v * Math.PI * 4 + Math.PI / 2) * 16);
  const scale = useTransform(p, (v) => 0.8 + Math.abs(Math.sin(v * Math.PI * 4)) * 0.25);
  const opacity = useTransform(p, [0, 0.04, 0.96, 1], [0, 0.9, 0.9, 0]);

  return (
    <motion.div
      aria-hidden
      style={{ top, left, rotate, scale, opacity, x: "-50%" }}
      className="blend-screen pointer-events-none fixed z-[5] w-[92px] sm:w-[150px] md:w-[200px]"
    >
      {/* soft white + gold aura behind the hand */}
      <div className="absolute inset-[8%] rounded-full bg-white/25 blur-3xl" />
      <div className="absolute inset-[18%] rounded-full bg-gold-400/30 blur-2xl" />
      <Image
        src="/images/palm-planets.png"
        alt=""
        width={1131}
        height={1414}
        className="relative h-auto w-full"
      />
    </motion.div>
  );
}
