import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useParams } from 'react-router-dom';
import { logger } from '@/lib/logger';

export function useSupplierViewTracking(supplierId?: string) {
  const params = useParams();
  const id = supplierId || params.supplierId || params.id;

  useEffect(() => {
    if (!id) return;

    const startTime = Date.now();
    let tracked = false;

    const trackView = async () => {
      if (tracked) return;
      tracked = true;

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);

        await supabase.functions.invoke('track-supplier-view', {
          body: {
            supplierId: id,
            timeSpent,
            referrer: document.referrer || 'direct',
          },
        });
      } catch (error) {
        logger.error('Failed to track supplier view', { error });
      }
    };

    // Track after 3 seconds to ensure meaningful view
    const timer = setTimeout(trackView, 3000);

    // Track when leaving page
    const handleBeforeUnload = () => trackView();
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      trackView();
    };
  }, [id]);
}
