"use client";

import { useEffect, useState } from "react";
import { ToastProvider } from "@/components/ui/toast";
import { BottomNav } from "@/components/BottomNav";
import { InstallPrompt } from "@/components/InstallPrompt";
import { DemoReceiver } from "@/components/DemoReceiver";
import { Onboarding } from "@/components/Onboarding";
import { initAudio } from "@/lib/audio";
import { getOnboarded, getFriends } from "@/lib/storage";

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    initAudio();

    // Register service worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(console.error);
    }

    if (!getOnboarded()) {
      setShowOnboarding(true);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold gradient-text animate-pulse">Faaah...</div>
      </div>
    );
  }

  if (showOnboarding) {
    return (
      <ToastProvider>
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <main className="pb-20 min-h-screen">{children}</main>
      <BottomNav />
      <InstallPrompt />
      <DemoReceiver />
    </ToastProvider>
  );
}
