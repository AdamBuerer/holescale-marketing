import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";
import { toast } from "sonner";

interface UploadCustomModelParams {
  mockupId: string;
  modelUrl: string;
}

export function useUploadCustomModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ mockupId, modelUrl }: UploadCustomModelParams) => {
      const { data, error } = await supabase
        .from('design_mockups')
        .update({ custom_model_url: modelUrl })
        .eq('id', mockupId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mockups"] });
      toast.success("Custom model uploaded successfully!");
    },
    onError: (error: Error) => {
      logger.error("Error uploading custom model", { error });
      toast.error(`Failed to upload custom model: ${error.message}`);
    },
  });
}
