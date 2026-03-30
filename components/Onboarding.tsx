"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Logo, LogoText } from "@/components/Logo";
import { setOnboarded } from "@/lib/storage";
import { initAudio, playFaaahSound } from "@/lib/audio";

const steps = [
  {
    emoji: "👋",
    title: "Welcome to Faaah!",
    description: "The daily friend appreciation app. Because your friends are awesome and they should know it.",
  },
  {
    emoji: "🎯",
    title: "5 Faahs Per Day",
    description: "You get 5 Faahs every day. Use them wisely... or not. Send them to friends who make your life better.",
  },
  {
    emoji: "🔊",
    title: "The Sacred Sound",
    description: "Every Faaah comes with THE sound. It's iconic. It's beautiful. Tap below to hear it.",
  },
  {
    emoji: "🎉",
    title: "You're all set!",
    description: "Add your friends and start spreading the love. Go make someone's day!",
  },
];

export function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step === 2) {
      initAudio();
      playFaaahSound();
    }
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      setOnboarded();
      onComplete();
    }
  };

  const current = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-orange-500/10" />

      <div className="relative z-10 w-full max-w-sm mx-auto px-6 text-center">
        <div className="mb-8 flex justify-center">
          <Logo size={64} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="text-6xl mb-6"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {current.emoji}
            </motion.div>

            <h2 className="text-2xl font-bold mb-3">{current.title}</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">{current.description}</p>

            {step === 2 && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="mb-6 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold"
                onClick={() => {
                  initAudio();
                  playFaaahSound();
                }}
              >
                🔊 Play Faaah Sound
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        <Button variant="gradient" size="xl" className="w-full" onClick={handleNext}>
          {step < steps.length - 1 ? "Next" : "Let's Go!"}
        </Button>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mt-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all ${
                i === step
                  ? "w-6 bg-gradient-to-r from-purple-500 to-pink-500"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
