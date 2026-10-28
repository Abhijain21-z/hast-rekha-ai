"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function FloatingHastrekhaBtn() {
  const [visible, setVisible] = useState(true);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);

  // Hide after form submission (listen to a simple event or use a timeout)
  useEffect(() => {
    const handler = () => setVisible(false);
    window.addEventListener("hr-form-submitted", handler);
    return () => window.removeEventListener("hr-form-submitted", handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed z-50 bottom-6 right-6 cursor-grab active:cursor-grabbing"
      style={{ transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)` }}
      draggable={false}
      onMouseDown={() => setDragging(true)}
      onMouseUp={() => setDragging(false)}
      onMouseLeave={() => setDragging(false)}
      onMouseMove={(e) => {
        if (dragging) {
          setDragOffset((prev) => ({ x: prev.x + e.movementX, y: prev.y + e.movementY }));
        }
      }}
    >
      <Link
        href="/reading"
        className="btn-gold inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold shadow-xl shadow-gold-400/30 transition hover:shadow-2xl"
      >
        <Sparkles className="h-4 w-4" />
        अपनी हस्तरेखा जानें
      </Link>
    </div>
  );
}
