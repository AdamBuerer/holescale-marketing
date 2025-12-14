import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useTypingIndicator(conversationId: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    if (!conversationId || !userId) return;

    const channel = supabase.channel(`typing-${conversationId}`);

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const typing = Object.keys(state)
          .filter((key) => key !== userId)
          .filter((key) => {
            const presences = state[key];
            if (presences && presences.length > 0) {
              const presence = presences[0] as any;
              return presence.typing === true;
            }
            return false;
          });
        setTypingUsers(typing);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId]);

  const setTyping = async (isTyping: boolean) => {
    if (!userId || !conversationId) return;

    const channel = supabase.channel(`typing-${conversationId}`);
    await channel.subscribe(async (status) => {
      if (status === "SUBSCRIBED") {
        await channel.track({
          userId,
          typing: isTyping,
        });
      }
    });
  };

  return { typingUsers, setTyping };
}
