"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Trash2, Info, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { getMuted, setMuted, playFaaahSound, initAudio } from "@/lib/audio";
import { Logo, LogoText } from "@/components/Logo";

export default function SettingsPage() {
  const [muted, setMutedState] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setMutedState(getMuted());
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleMute = () => {
    const newMuted = !muted;
    setMuted(newMuted);
    setMutedState(newMuted);
    if (!newMuted) {
      initAudio();
      playFaaahSound();
    }
    toast(newMuted ? "Sound muted 🔇" : "Sound on 🔊", "default");
  };

  const toggleTheme = () => {
    const newDark = !darkMode;
    setDarkMode(newDark);
    document.documentElement.classList.toggle("dark", newDark);
    localStorage.setItem("faaah-theme", newDark ? "dark" : "light");
    toast(newDark ? "Dark mode on 🌙" : "Light mode on ☀️", "default");
  };

  const clearData = () => {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith("faaah-"));
    keys.forEach((k) => localStorage.removeItem(k));
    toast("All data cleared!", "default");
    window.location.reload();
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <div className="space-y-3">
        {/* Sound */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center gap-3">
            {muted ? (
              <VolumeX size={20} className="text-muted-foreground" />
            ) : (
              <Volume2 size={20} className="text-purple-400" />
            )}
            <div>
              <p className="font-medium">Sound</p>
              <p className="text-xs text-muted-foreground">
                {muted ? "Faaah sound is off" : "Faaah sound is on"}
              </p>
            </div>
          </div>
          <button
            onClick={toggleMute}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              !muted ? "bg-purple-500" : "bg-secondary"
            }`}
          >
            <motion.div
              className="w-5 h-5 rounded-full bg-white absolute top-1"
              animate={{ left: !muted ? 24 : 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          </button>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center gap-3">
            {darkMode ? (
              <Moon size={20} className="text-purple-400" />
            ) : (
              <Sun size={20} className="text-orange-400" />
            )}
            <div>
              <p className="font-medium">Theme</p>
              <p className="text-xs text-muted-foreground">
                {darkMode ? "Dark mode" : "Light mode"}
              </p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className={`w-12 h-7 rounded-full transition-colors relative ${
              darkMode ? "bg-purple-500" : "bg-orange-400"
            }`}
          >
            <motion.div
              className="w-5 h-5 rounded-full bg-white absolute top-1"
              animate={{ left: darkMode ? 24 : 4 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            />
          </button>
        </motion.div>

        {/* Clear Data */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between p-4 rounded-2xl bg-card border border-border"
        >
          <div className="flex items-center gap-3">
            <Trash2 size={20} className="text-red-400" />
            <div>
              <p className="font-medium">Clear All Data</p>
              <p className="text-xs text-muted-foreground">Reset everything</p>
            </div>
          </div>
          <Button variant="destructive" size="sm" onClick={clearData}>
            Clear
          </Button>
        </motion.div>
      </div>

      {/* About */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-12 text-center"
      >
        <div className="flex justify-center mb-3">
          <Logo size={48} />
        </div>
        <LogoText className="text-xl" />
        <p className="text-xs text-muted-foreground mt-2">
          v1.0.0 &middot; Made with 💜
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Send love to your friends, every single day.
        </p>
      </motion.div>
    </div>
  );
}
