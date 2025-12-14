import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function useKeyboardShortcuts() {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only trigger on Cmd/Ctrl key combinations
      if (!(e.metaKey || e.ctrlKey)) return;

      // Don't trigger if user is typing in an input
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      switch (e.key) {
        case 'k': {
          e.preventDefault();
          // Open search - trigger search input focus
          const searchInput = document.querySelector('[data-search-input]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          }
          break;
        }
        
        case 'n':
          e.preventDefault();
          if (hasRole('buyer')) {
            navigate('/buyer/rfq/new');
          } else if (hasRole('supplier')) {
            navigate('/supplier/products');
          }
          break;
        
        case 'm':
          e.preventDefault();
          if (hasRole('supplier')) {
            navigate('/supplier/messages');
          } else if (hasRole('admin')) {
            navigate('/admin/messages');
          } else {
            navigate('/buyer/messages');
          }
          break;
        
        case 'h':
          e.preventDefault();
          if (hasRole('admin')) {
            navigate('/admin/dashboard');
          } else if (hasRole('buyer')) {
            navigate('/buyer/dashboard');
          } else if (hasRole('supplier')) {
            navigate('/supplier/dashboard');
          }
          break;

        case 'o':
          e.preventDefault();
          if (hasRole('supplier')) {
            navigate('/supplier/orders');
          } else if (hasRole('buyer')) {
            navigate('/buyer/orders');
          } else if (hasRole('admin')) {
            navigate('/admin/orders');
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate, hasRole]);
}
