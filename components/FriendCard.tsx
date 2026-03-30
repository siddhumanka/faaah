"use client";

import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { type Friend } from "@/lib/storage";

interface FriendCardProps {
  friend: Friend;
  onRemove: (id: string) => void;
  index: number;
}

export function FriendCard({ friend, onRemove, index }: FriendCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 p-4 rounded-2xl bg-card border border-border hover:border-purple-500/30 transition-colors group"
    >
      <span className="text-3xl">{friend.emoji}</span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-foreground truncate">{friend.name}</p>
        <p className="text-xs text-muted-foreground">
          Added {new Date(friend.addedAt).toLocaleDateString()}
        </p>
      </div>
      <button
        onClick={() => onRemove(friend.id)}
        className="opacity-0 group-hover:opacity-100 p-2 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
}
