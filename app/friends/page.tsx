"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FriendCard } from "@/components/FriendCard";
import { useToast } from "@/components/ui/toast";
import { getFriends, addFriend, removeFriend, type Friend } from "@/lib/storage";

const EMOJI_OPTIONS = ["😊", "🔥", "💜", "✨", "🌟", "🎵", "🌸", "⚡", "🍕", "🎮", "📚", "🏀"];

export default function FriendsPage() {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("😊");
  const { toast } = useToast();

  useEffect(() => {
    setFriends(getFriends());
  }, []);

  const handleAdd = () => {
    if (!name.trim()) {
      toast("Enter a name!", "error");
      return;
    }
    const friend = addFriend(name.trim(), emoji);
    setFriends([...friends, friend]);
    setName("");
    setEmoji("😊");
    setShowAdd(false);
    toast(`${emoji} ${name} added!`, "success");
  };

  const handleRemove = (id: string) => {
    removeFriend(id);
    setFriends(friends.filter((f) => f.id !== id));
    toast("Friend removed", "default");
  };

  return (
    <div className="max-w-lg mx-auto px-4 pt-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Friends</h1>
          <p className="text-sm text-muted-foreground">{friends.length} friends</p>
        </div>
        <Button variant="gradient" onClick={() => setShowAdd(true)}>
          <Plus size={18} className="mr-2" />
          Add
        </Button>
      </div>

      {friends.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 px-6"
        >
          <motion.div
            className="text-6xl mb-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            👥
          </motion.div>
          <p className="font-semibold mb-2">Your friend list is empty</p>
          <p className="text-sm text-muted-foreground mb-6">
            Add your besties so you can send them daily Faahs!
          </p>
          <Button variant="gradient" size="lg" onClick={() => setShowAdd(true)}>
            <UserPlus size={18} className="mr-2" />
            Add Your First Friend
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {friends.map((friend, i) => (
              <FriendCard
                key={friend.id}
                friend={friend}
                onRemove={handleRemove}
                index={i}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add Friend Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Friend</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter friend's name"
                className="w-full px-4 py-3 rounded-xl bg-secondary border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground mb-2 block">
                Pick an emoji
              </label>
              <div className="flex flex-wrap gap-2">
                {EMOJI_OPTIONS.map((e) => (
                  <button
                    key={e}
                    onClick={() => setEmoji(e)}
                    className={`text-2xl p-2 rounded-xl transition-all ${
                      emoji === e
                        ? "bg-purple-500/20 ring-2 ring-purple-500 scale-110"
                        : "hover:bg-secondary"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            <Button variant="gradient" size="lg" className="w-full" onClick={handleAdd}>
              Add {name || "Friend"} {emoji}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
