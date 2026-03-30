"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { playFaaahSound } from "@/lib/audio";
import { sendFaaah, addEvent, type Friend } from "@/lib/storage";
import { useToast } from "@/components/ui/toast";

interface FaaahButtonProps {
  friend: Friend;
  remaining: number;
  onSend: () => void;
}

export function FaaahButton({ friend, remaining, onSend }: FaaahButtonProps) {
  const [isShaking, setIsShaking] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (remaining <= 0) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      toast("No Faahs left today! Come back tomorrow", "error");
      return;
    }

    setIsSending(true);

    const result = sendFaaah(friend.id);
    if (!result) {
      toast("Something went wrong", "error");
      setIsSending(false);
      return;
    }

    addEvent({
      type: "sent",
      friendId: friend.id,
      friendName: friend.name,
      timestamp: new Date().toISOString(),
    });

    await playFaaahSound();

    // Fire confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.7 },
      colors: ["#a855f7", "#ec4899", "#f97316", "#facc15"],
    });

    toast(`Faaah sent to ${friend.name}! ${friend.emoji}`, "success");
    onSend();

    setTimeout(() => setIsSending(false), 600);
  };

  return (
    <motion.button
      onClick={handleSend}
      className={`relative w-full py-4 px-6 rounded-2xl font-bold text-white text-lg shadow-lg transition-colors ${
        remaining > 0
          ? "bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 shadow-purple-500/30"
          : "bg-gray-400 dark:bg-gray-600"
      }`}
      animate={isShaking ? { x: [-4, 4, -4, 4, 0] } : {}}
      transition={{ duration: 0.4 }}
      whileTap={remaining > 0 ? { scale: 0.93 } : {}}
    >
      <AnimatePresence mode="wait">
        {isSending ? (
          <motion.span
            key="sending"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            <SoundWave /> Faaah!
          </motion.span>
        ) : (
          <motion.span
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2"
          >
            {friend.emoji} Send Faaah to {friend.name}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

function SoundWave() {
  return (
    <div className="flex items-center gap-0.5 h-5">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-white rounded-full"
          animate={{ height: ["8px", "20px", "8px"] }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
