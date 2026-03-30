"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { cn } from "@/lib/cn";

interface Toast {
  id: string;
  message: string;
  type?: "default" | "success" | "error";
}

interface ToastContextType {
  toast: (message: string, type?: Toast["type"]) => void;
}

const ToastContext = createContext<ToastContextType>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast["type"] = "default") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ toast: addToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "px-5 py-3 rounded-2xl text-sm font-medium shadow-xl animate-bounce-in backdrop-blur-md",
              t.type === "success" && "bg-green-500/90 text-white",
              t.type === "error" && "bg-red-500/90 text-white",
              t.type === "default" && "bg-white/90 text-gray-900 dark:bg-gray-800/90 dark:text-white"
            )}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
