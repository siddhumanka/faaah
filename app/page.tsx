"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import Link from "next/link";
import { Logo, LogoText } from "@/components/Logo";
import { FaaahButton } from "@/components/FaaahButton";
import { Button } from "@/components/ui/button";
import { getDailyState, getFriends, getStats, type Friend } from "@/lib/storage";

export default function HomePage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [remaining, setRemaining] = useState(5);
  const [stats, setStats] = useState({ totalSent: 0, totalReceived: 0, todaySent: 0, todayReceived: 0 });

  const refresh = useCallback(() => {
    setFriends(getFriends());
    setRemaining(getDailyState().remaining);
    setStats(getStats());
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [refresh]);

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Logo size={40} />
          <LogoText className="text-2xl" />
        </div>
        <motion.div
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
          animate={remaining === 0 ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Sparkles size={16} className="text-purple-400" />
          <span className="font-bold text-lg gradient-text">{remaining}</span>
          <span className="text-xs text-muted-foreground">left</span>
        </motion.div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/10"
        >
          <p className="text-2xl font-bold gradient-text">{stats.totalSent}</p>
          <p className="text-xs text-muted-foreground">Faahs Sent</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-orange-500/5 border border-pink-500/10"
        >
          <p className="text-2xl font-bold gradient-text">{stats.totalReceived}</p>
          <p className="text-xs text-muted-foreground">Faahs Received</p>
        </motion.div>
      </div>

      {/* Quick Send */}
      <div className="mb-6">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          Quick Send
          <span className="text-xs font-normal text-muted-foreground">
            ({stats.todaySent}/5 today)
          </span>
        </h2>

        {friends.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 px-6 rounded-3xl bg-card border border-dashed border-border"
          >
            <p className="text-4xl mb-4">🫂</p>
            <p className="font-semibold mb-2">No friends yet!</p>
            <p className="text-sm text-muted-foreground mb-4">
              Add your first friend to start sending Faahs
            </p>
            <Link href="/friends">
              <Button variant="gradient" size="lg">
                <Plus size={18} className="mr-2" />
                Add Friends
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {friends.map((friend, i) => (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <FaaahButton
                  friend={friend}
                  remaining={remaining}
                  onSend={refresh}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Today's Faahs received */}
      {stats.todayReceived > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 text-center"
        >
          <p className="text-sm text-muted-foreground">Today you received</p>
          <p className="text-3xl font-bold text-green-400">{stats.todayReceived} Faahs</p>
          <p className="text-xs text-muted-foreground mt-1">Your friends appreciate you!</p>
        </motion.div>
      )}
    </div>
  );
}
