import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useModelAnalytics(modelId?: string) {
  return useQuery({
    queryKey: ["model-analytics", modelId],
    queryFn: async () => {
      if (!modelId) return null;

      const { data, error } = await supabase
        .from("model_usage")
        .select("action_type")
        .eq("model_id", modelId);

      if (error) throw error;

      const analytics = {
        views: data.filter((u) => u.action_type === "view").length,
        downloads: data.filter((u) => u.action_type === "download").length,
        attaches: data.filter((u) => u.action_type === "attach").length,
        total: data.length,
      };

      return analytics;
    },
    enabled: !!modelId,
  });
}

export function useTrackModelUsage() {
  return useMutation({
    mutationFn: async ({
      modelId,
      actionType,
    }: {
      modelId: string;
      actionType: "view" | "download" | "attach";
    }) => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { error } = await supabase.from("model_usage").insert({
        model_id: modelId,
        user_id: user?.id,
        action_type: actionType,
      });

      if (error) throw error;
    },
  });
}

export function useAllModelAnalytics() {
  return useQuery({
    queryKey: ["all-model-analytics"],
    queryFn: async () => {
      const { data: models, error: modelsError } = await supabase
        .from("model_library")
        .select("id, name, category");

      if (modelsError) throw modelsError;

      const { data: usage, error: usageError } = await supabase
        .from("model_usage")
        .select("model_id, action_type");

      if (usageError) throw usageError;

      const analytics = models.map((model) => {
        const modelUsage = usage.filter((u) => u.model_id === model.id);
        return {
          ...model,
          views: modelUsage.filter((u) => u.action_type === "view").length,
          downloads: modelUsage.filter((u) => u.action_type === "download")
            .length,
          attaches: modelUsage.filter((u) => u.action_type === "attach").length,
          total: modelUsage.length,
        };
      });

      return analytics.sort((a, b) => b.total - a.total);
    },
  });
}
