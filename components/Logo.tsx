"use client";

import { motion } from "framer-motion";

export function Logo({ size = 48 }: { size?: number }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <defs>
        <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="50%" stopColor="#ec4899" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#c084fc" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>

      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="url(#logoGrad)" opacity="0.15" />

      {/* Sound waves */}
      {[0, 1, 2].map((i) => (
        <motion.path
          key={i}
          d={`M${58 + i * 10},35 Q${65 + i * 10},50 ${58 + i * 10},65`}
          fill="none"
          stroke="url(#waveGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ opacity: 0, pathLength: 0 }}
          animate={{ opacity: [0.3, 0.8, 0.3], pathLength: 1 }}
          transition={{
            opacity: { repeat: Infinity, duration: 2, delay: i * 0.3 },
            pathLength: { duration: 0.8, delay: 0.3 + i * 0.15 },
          }}
        />
      ))}

      {/* F letter */}
      <motion.text
        x="18"
        y="68"
        fontSize="52"
        fontWeight="900"
        fontFamily="system-ui, -apple-system, sans-serif"
        fill="url(#logoGrad)"
        initial={{ y: 80 }}
        animate={{ y: 68 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
      >
        F
      </motion.text>
    </motion.svg>
  );
}

export function LogoText({ className }: { className?: string }) {
  return (
    <motion.span
      className={`font-black bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 bg-clip-text text-transparent ${className}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
    >
      Faaah
    </motion.span>
  );
}
