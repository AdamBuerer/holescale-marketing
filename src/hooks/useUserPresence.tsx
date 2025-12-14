import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface UserPresence {
  userId: string;
  status: "online" | "away" | "offline";
  lastSeen: string;
}

export function useUserPresence(userId: string | null) {
  const [presence, setPresence] = useState<UserPresence | null>(null);
  const [myUserId, setMyUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setMyUserId(user.id);
    });
  }, []);

  useEffect(() => {
    if (!userId || !myUserId) return;

    const channel = supabase.channel(`presence-${userId}`);

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();
        const presences = state[userId];
        if (presences && presences.length > 0) {
          const latestPresence = presences[0] as any;
          setPresence({
            userId,
            status: latestPresence.status || "offline",
            lastSeen: latestPresence.lastSeen || new Date().toISOString(),
          });
        } else {
          setPresence({
            userId,
            status: "offline",
            lastSeen: new Date().toISOString(),
          });
        }
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        if (key === userId && newPresences && newPresences.length > 0) {
          const presence = newPresences[0] as any;
          setPresence({
            userId,
            status: presence.status || "online",
            lastSeen: presence.lastSeen || new Date().toISOString(),
          });
        }
      })
      .on("presence", { event: "leave" }, ({ key }) => {
        if (key === userId) {
          setPresence({
            userId,
            status: "offline",
            lastSeen: new Date().toISOString(),
          });
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, myUserId]);

  return presence;
}

export function useMyPresence() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  useEffect(() => {
    if (!userId) return;

    const channel = supabase.channel(`presence-${userId}`);

    const trackPresence = async () => {
      await channel.subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            userId,
            status: "online",
            lastSeen: new Date().toISOString(),
          });
        }
      });
    };

    trackPresence();

    // Update presence every 30 seconds
    const interval = setInterval(() => {
      channel.track({
        userId,
        status: "online",
        lastSeen: new Date().toISOString(),
      });
    }, 30000);

    // Handle page visibility
    const handleVisibilityChange = () => {
      if (document.hidden) {
        channel.track({
          userId,
          status: "away",
          lastSeen: new Date().toISOString(),
        });
      } else {
        channel.track({
          userId,
          status: "online",
          lastSeen: new Date().toISOString(),
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      supabase.removeChannel(channel);
    };
  }, [userId]);
}
