import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';
import { ModelType, LogoTransform, ModelDimensions, DEFAULT_DIMENSIONS } from '@/types/3d-models';

export interface ThreeDPreviewData {
  mockupId: string;
  modelType: ModelType;
  logoTransform: LogoTransform;
  dimensions: ModelDimensions;
  designUrl: string;
}

export function use3DPreview() {
  const queryClient = useQueryClient();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [currentPreview, setCurrentPreview] = useState<ThreeDPreviewData | null>(null);

  const openPreview = useCallback((data: ThreeDPreviewData) => {
    setCurrentPreview(data);
    setIsPreviewOpen(true);
  }, []);

  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setCurrentPreview(null);
  }, []);

  const updateLogoTransform = useCallback((transform: LogoTransform) => {
    if (currentPreview) {
      setCurrentPreview({
        ...currentPreview,
        logoTransform: transform
      });
    }
  }, [currentPreview]);

  const updateDimensions = useCallback((dimensions: ModelDimensions) => {
    if (currentPreview) {
      setCurrentPreview({
        ...currentPreview,
        dimensions
      });
    }
  }, [currentPreview]);

  const updateModelType = useCallback((modelType: ModelType) => {
    if (currentPreview) {
      setCurrentPreview({
        ...currentPreview,
        modelType,
        dimensions: DEFAULT_DIMENSIONS[modelType],
      });
    }
  }, [currentPreview]);

  const save3DPreview = useMutation({
    mutationFn: async (data: ThreeDPreviewData) => {
      const { data: updatedMockup, error } = await supabase
        .from('design_mockups')
        .update({
          model_type: data.modelType,
          logo_transform: data.logoTransform as any,
        })
        .eq('id', data.mockupId)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!updatedMockup) {
        throw new Error('Mockup not found or update failed');
      }
      return updatedMockup;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mockups'] });
      toast.success('3D preview settings saved');
    },
    onError: (error: Error) => {
      logger.error('Error saving 3D preview', { error });
      toast.error('Failed to save 3D preview settings');
    },
  });

  const downloadPreview = useCallback(async () => {
    try {
      // This would trigger the screenshot endpoint
      // For now, we'll just show a toast
      toast.info('Screenshot feature will be available soon');
    } catch (error) {
      logger.error('Error downloading preview', { error });
      toast.error('Failed to download preview');
    }
  }, []);

  return {
    isPreviewOpen,
    currentPreview,
    openPreview,
    closePreview,
    updateLogoTransform,
    updateModelType,
    updateDimensions,
    save3DPreview,
    downloadPreview,
  };
}
