import { useState, useEffect } from "react";

interface Reaction {
  emoji: string;
  users: string[];
}

interface MessageReactions {
  [messageId: string]: Reaction[];
}

export function useMessageReactions(conversationId: string) {
  const [reactions, setReactions] = useState<MessageReactions>({});

  useEffect(() => {
    loadReactions();
  }, [conversationId]);

  const loadReactions = () => {
    const stored = localStorage.getItem(`reactions_${conversationId}`);
    if (stored) {
      setReactions(JSON.parse(stored));
    }
  };

  const addReaction = (messageId: string, emoji: string, userId: string) => {
    setReactions(prev => {
      const messageReactions = prev[messageId] || [];
      const existingReaction = messageReactions.find(r => r.emoji === emoji);

      let updated;
      if (existingReaction) {
        if (existingReaction.users.includes(userId)) {
          // Remove reaction
          updated = {
            ...prev,
            [messageId]: messageReactions.map(r =>
              r.emoji === emoji
                ? { ...r, users: r.users.filter(u => u !== userId) }
                : r
            ).filter(r => r.users.length > 0)
          };
        } else {
          // Add user to reaction
          updated = {
            ...prev,
            [messageId]: messageReactions.map(r =>
              r.emoji === emoji
                ? { ...r, users: [...r.users, userId] }
                : r
            )
          };
        }
      } else {
        // New reaction
        updated = {
          ...prev,
          [messageId]: [...messageReactions, { emoji, users: [userId] }]
        };
      }

      localStorage.setItem(`reactions_${conversationId}`, JSON.stringify(updated));
      return updated;
    });
  };

  const getMessageReactions = (messageId: string) => {
    return reactions[messageId] || [];
  };

  return { addReaction, getMessageReactions };
}
