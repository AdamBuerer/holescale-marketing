import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

export interface ModelLibraryItem {
  id: string;
  name: string;
  category: string;
  subcategory?: string;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  tags?: string[];
  material_type?: string;
  typical_use_case?: string;
  thumbnail_url?: string | null;
  model_url?: string | null;
  is_premium?: boolean;
  is_featured?: boolean;
  description?: string | null;
  prompt?: string | null;
  source?: string;
  created_at: string;
  created_by?: string;
  updated_at?: string;
}

interface UseModelLibraryOptions {
  category?: string;
  subcategory?: string;
  search?: string;
  isPremium?: boolean;
}

// Backward compatible - accepts string or options object
export function useModelLibrary(categoryOrOptions?: string | UseModelLibraryOptions) {
  const options: UseModelLibraryOptions = typeof categoryOrOptions === 'string'
    ? { category: categoryOrOptions }
    : (categoryOrOptions || {});

  return useQuery({
    queryKey: ['model-library', JSON.stringify(options)],
    queryFn: async () => {
      const { data, error} = await supabase
        .from('model_library')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      
      let filtered: ModelLibraryItem[] = (data || []) as ModelLibraryItem[];
      
      // Apply filters
      if (options.category) {
        filtered = filtered.filter(item => item.category === options.category);
      }
      
      if (options.subcategory) {
        filtered = filtered.filter(item => item.subcategory === options.subcategory);
      }
      
      if (options.search) {
        const searchLower = options.search.toLowerCase();
        filtered = filtered.filter(item => 
          item.name?.toLowerCase().includes(searchLower) ||
          item.category?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower) ||
          item.tags?.some((tag: string) => tag.toLowerCase().includes(searchLower))
        );
      }
      
      if (options.isPremium !== undefined) {
        filtered = filtered.filter(item => item.is_premium === options.isPremium);
      }

      return filtered as ModelLibraryItem[];
    },
  });
}

export function useModelLibraryCategories() {
  return useQuery({
    queryKey: ['model-library-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('model_library')
        .select('category')
        .order('category');

      if (error) {
        logger.error('Error fetching categories', { error });
        return [] as { category: string; subcategories: string[] }[];
      }

      const categories = Array.from(new Set((data || []).map((i: ModelLibraryItem) => i.category))).filter(Boolean);
      return categories.map((category) => ({ category, subcategories: [] }));
    },
  });
}

export function useGenerateMeshyModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ prompt, category }: { prompt: string; category: string }) => {
      const { data, error } = await supabase.functions.invoke('generate-3d-model-meshy', {
        body: { prompt, category },
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['model-library'] });
      toast.success('3D model generated successfully!');
    },
    onError: (error: Error) => {
      logger.error('Failed to generate model', { error });
      toast.error(`Failed to generate model: ${error.message}`);
    },
  });
}

export function useDeleteModelLibraryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (modelId: string) => {
      const { error } = await supabase
        .from('model_library')
        .delete()
        .eq('id', modelId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['model-library'] });
      toast.success('Model deleted successfully');
    },
    onError: (error: Error) => {
      logger.error('Failed to delete model', { error });
      toast.error(`Failed to delete model: ${error.message}`);
    },
  });
}
