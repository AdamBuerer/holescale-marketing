/**
 * useImageProcessor Hook
 * 
 * Hook for processing product images through the Edge Function pipeline.
 * Handles image preprocessing, background removal, and status tracking.
 * 
 * Usage:
 * ```tsx
 * const { processImage, isProcessing, error, status } = useImageProcessor();
 * 
 * const handleProcess = async () => {
 *   const result = await processImage({
 *     imageUrl: 'https://...',
 *     removeBackground: true,
 *     productId: '...',
 *     imageId: '...'
 *   });
 *   console.log('Processed URL:', result.processedUrl);
 * };
 * ```
 */

import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'failed';

export interface ProcessImageOptions {
  imageUrl: string;
  removeBackground?: boolean;
  productId?: string;
  imageId?: string;
}

export interface ProcessImageResult {
  processedUrl: string;
  hasTransparentBg: boolean;
  originalSize: number;
  processedSize: number;
}

export interface UseImageProcessorReturn {
  processImage: (options: ProcessImageOptions) => Promise<ProcessImageResult | null>;
  isProcessing: boolean;
  status: ProcessingStatus;
  error: string | null;
  reset: () => void;
}

export function useImageProcessor(): UseImageProcessorReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const processImage = useCallback(async (
    options: ProcessImageOptions
  ): Promise<ProcessImageResult | null> => {
    try {
      setIsProcessing(true);
      setStatus('processing');
      setError(null);

      // Get Supabase function URL
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const functionUrl = `${supabaseUrl}/functions/v1/process-product-image`;

      // Get auth token
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      // Call Edge Function
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({
          imageUrl: options.imageUrl,
          removeBackground: options.removeBackground ?? false,
          productId: options.productId,
          imageId: options.imageId,
          userId: session.user.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Processing failed');
      }

      const processedResult: ProcessImageResult = {
        processedUrl: result.processedUrl,
        hasTransparentBg: result.hasTransparentBg,
        originalSize: result.originalSize,
        processedSize: result.processedSize,
      };

      setStatus('completed');
      toast.success('Image processed successfully!');
      logger.info('Image processed', {
        processedUrl: processedResult.processedUrl,
        originalSize: processedResult.originalSize,
        processedSize: processedResult.processedSize,
      });

      return processedResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to process image';
      setError(errorMessage);
      setStatus('failed');
      logger.error('Image processing error', { error: err, options });
      toast.error(`Image processing failed: ${errorMessage}`);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    processImage,
    isProcessing,
    status,
    error,
    reset,
  };
}

