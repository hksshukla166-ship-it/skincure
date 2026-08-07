"use client";

import { motion } from "framer-motion";

const FLOATING_ORBS = [
  { size: 120, x: "10%", y: "20%", color: "from-blue-400/30 to-blue-600/20", delay: 0, duration: 8 },
  { size: 80, x: "75%", y: "15%", color: "from-gold-400/25 to-gold-600/15", delay: 1, duration: 10 },
  { size: 100, x: "85%", y: "60%", color: "from-blue-300/20 to-primary-500/15", delay: 2, duration: 9 },
  { size: 60, x: "5%", y: "70%", color: "from-gold-300/30 to-gold-500/20", delay: 0.5, duration: 7 },
  { size: 140, x: "50%", y: "80%", color: "from-primary-400/15 to-blue-500/10", delay: 1.5, duration: 11 },
  { size: 50, x: "30%", y: "40%", color: "from-gold-400/20 to-gold-600/10", delay: 2.5, duration: 6 },
  { size: 90, x: "60%", y: "35%", color: "from-blue-500/20 to-primary-600/15", delay: 0.8, duration: 8.5 },
];

const PARTICLES = Array.from({ length: 40 }, (_, i) => ({
  id: i,
  x: `${Math.random() * 100}%`,
  y: `${Math.random() * 100}%`,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 5,
  duration: Math.random() * 4 + 4,
}));

export default function Hero3D() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Animated gradient mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50/80 via-white/50 to-primary-100/80" />

      <motion.div
        className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary-300/20 to-transparent blur-3xl"
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-gradient-radial from-gold-300/15 to-transparent blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating orbs (skin cell effect) */}
      {FLOATING_ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full bg-gradient-to-br ${orb.color} backdrop-blur-sm border border-white/20 shadow-glass`}
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            scale: [1, 1.05, 0.95, 1.02, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay,
          }}
        />
      ))}

      {/* Gold particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-gold-400/60"
          style={{
            width: p.size,
            height: p.size,
            left: p.x,
            top: p.y,
          }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.8, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}

      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(30,58,138,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(30,58,138,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Medical cross icons floating */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`icon-${i}`}
          className="absolute text-primary-400/10 font-bold text-2xl select-none"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 6 + i,
            repeat: Infinity,
            delay: i * 0.7,
          }}
        >
          ✦
        </motion.div>
      ))}
    </div>
  );
}
