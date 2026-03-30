"use client";

import { useEffect, useCallback } from "react";
import { addEvent, getFriends } from "@/lib/storage";
import { playFaaahSound } from "@/lib/audio";
import { useToast } from "@/components/ui/toast";

const DEMO_NAMES = ["Alex", "Jordan", "Sam", "Riley", "Casey"];
const DEMO_EMOJIS = ["🌟", "💜", "🔥", "✨", "🎵"];

export function DemoReceiver() {
  const { toast } = useToast();

  const simulateReceive = useCallback(() => {
    const friends = getFriends();
    if (friends.length === 0) return;

    const friend = friends[Math.floor(Math.random() * friends.length)];

    addEvent({
      type: "received",
      friendId: friend.id,
      friendName: friend.name,
      timestamp: new Date().toISOString(),
    });

    playFaaahSound();
    toast(`${friend.emoji} ${friend.name} sent you a Faaah!`, "success");
  }, [toast]);

  useEffect(() => {
    // Random demo receive between 30-90 seconds
    const scheduleNext = () => {
      const delay = 30000 + Math.random() * 60000;
      return setTimeout(() => {
        simulateReceive();
        timerRef = scheduleNext();
      }, delay);
    };

    let timerRef = scheduleNext();
    return () => clearTimeout(timerRef);
  }, [simulateReceive]);

  return null;
}
