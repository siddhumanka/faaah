"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUp, ArrowDown } from "lucide-react";
import { getEvents, getStats, type FaaahEvent } from "@/lib/storage";

export default function ActivityPage() {
  const [events, setEvents] = useState<FaaahEvent[]>([]);
  const [stats, setStats] = useState({ totalSent: 0, totalReceived: 0, todaySent: 0, todayReceived: 0 });
  const [filter, setFilter] = useState<"all" | "sent" | "received">("all");

  useEffect(() => {
    setEvents(getEvents());
    setStats(getStats());
  }, []);

  const filtered = events.filter((e) => {
    if (filter === "all") return true;
    return e.type === filter;
  });

  // Group by date
  const grouped = filtered.reduce<Record<string, FaaahEvent[]>>((acc, event) => {
    const date = event.timestamp.split("T")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(event);
    return acc;
  }, {});

  const formatDate = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
    if (dateStr === today) return "Today";
    if (dateStr === yesterday) return "Yesterday";
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (ts: string) =>
    new Date(ts).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <h1 className="text-2xl font-bold mb-2">Activity</h1>
      <p className="text-sm text-muted-foreground mb-6">Your Faaah history</p>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[
          { label: "Sent Today", value: stats.todaySent, color: "purple" },
          { label: "Received Today", value: stats.todayReceived, color: "green" },
          { label: "Total Sent", value: stats.totalSent, color: "pink" },
          { label: "Total Received", value: stats.totalReceived, color: "orange" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-3 rounded-xl bg-card border border-border text-center"
          >
            <p className="text-lg font-bold gradient-text">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground leading-tight">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-6">
        {(["all", "sent", "received"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? "bg-purple-500 text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Timeline */}
      {Object.keys(grouped).length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <p className="text-4xl mb-4">📭</p>
          <p className="font-semibold mb-2">No activity yet</p>
          <p className="text-sm text-muted-foreground">
            Start sending Faahs to see your history here!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, dayEvents]) => (
            <div key={date}>
              <h3 className="text-sm font-semibold text-muted-foreground mb-3 sticky top-0 bg-background/80 backdrop-blur-sm py-1">
                {formatDate(date)}
              </h3>
              <div className="space-y-2">
                {dayEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: event.type === "sent" ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        event.type === "sent"
                          ? "bg-purple-500/10 text-purple-400"
                          : "bg-green-500/10 text-green-400"
                      }`}
                    >
                      {event.type === "sent" ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {event.type === "sent"
                          ? `Sent to ${event.friendName}`
                          : `Received from ${event.friendName}`}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatTime(event.timestamp)}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-lg bg-secondary text-muted-foreground">
                      Faaah
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
