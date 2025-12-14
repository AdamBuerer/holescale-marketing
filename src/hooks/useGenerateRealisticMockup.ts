import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { logger } from "@/lib/logger";

interface GenerateRealisticMockupParams {
  designUrl: string;
  templateId: string;
}

export function useGenerateRealisticMockup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ designUrl, templateId }: GenerateRealisticMockupParams) => {
      const mockupId = crypto.randomUUID();

      let publicDesignUrl = designUrl;

      // If designUrl is a data URL, upload to storage first to get public URL
      if (designUrl.startsWith('data:')) {
        
        // Convert data URL to blob
        const response = await fetch(designUrl);
        const blob = await response.blob();
        const fileName = `design-${mockupId}.png`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('mockups')
          .upload(fileName, blob, {
            contentType: 'image/png',
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          logger.error('Upload error', { error: uploadError });
          throw new Error('Failed to upload design. Please try again.');
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('mockups')
          .getPublicUrl(fileName);

        publicDesignUrl = publicUrl;
      }
      const { data, error } = await supabase.functions.invoke('render-mockup', {
        body: {
          mockupId,
          designUrl: publicDesignUrl,
          templateId,
        },
      });

      if (error) {
        logger.error('Edge function error', { error });
        throw new Error('Service temporarily unavailable. Please try again.');
      }
      
      if (!data.success) {
        logger.error('Mockup generation failed', { error: data.error });
        
        // Provide specific error messages
        if (data.error?.includes('401') || data.error?.includes('authentication')) {
          throw new Error('API authentication failed. Please contact support.');
        } else if (data.error?.includes('404') || data.error?.includes('template')) {
          throw new Error('Template not found. Please select a different template.');
        } else {
          throw new Error(data.error || 'Failed to generate mockup. Please try again.');
        }
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mockups"] });
      toast.success("HD mockup generated successfully!");
    },
    onError: (error: Error) => {
      logger.error("Mockup generation error", { error });
      toast.error(error.message || "Failed to generate mockup");
    },
  });
}
