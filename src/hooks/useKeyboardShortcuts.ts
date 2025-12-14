import { useEffect } from "react";

/**
 * Global keyboard shortcuts hook
 * Implements app-wide keyboard navigation shortcuts
 */
export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field
      const isInputActive = 
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA' ||
        document.activeElement?.getAttribute('contenteditable') === 'true';

      if (isInputActive) return;

      // CMD/CTRL + K: Focus search (if search exists on page)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector<HTMLInputElement>('[data-search-input]');
        searchInput?.focus();
        return;
      }

      // CMD/CTRL + /: Show keyboard shortcuts help
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        // Could trigger a modal with keyboard shortcuts
        return;
      }

      // ESC: Close modals/dialogs
      if (e.key === 'Escape') {
        const openDialog = document.querySelector('[role="dialog"][data-state="open"]');
        if (openDialog) {
          const closeButton = openDialog.querySelector('[aria-label="Close"]');
          if (closeButton instanceof HTMLElement) {
            closeButton.click();
          }
        }
        return;
      }

      // Arrow navigation in lists (when focus is on a list item)
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        const focusedElement = document.activeElement;
        const listItem = focusedElement?.closest('[role="listitem"], [data-list-item]');
        
        if (listItem) {
          e.preventDefault();
          const allItems = Array.from(
            listItem.parentElement?.querySelectorAll('[role="listitem"], [data-list-item]') || []
          );
          const currentIndex = allItems.indexOf(listItem);
          
          if (e.key === 'ArrowDown' && currentIndex < allItems.length - 1) {
            (allItems[currentIndex + 1] as HTMLElement)?.focus();
          } else if (e.key === 'ArrowUp' && currentIndex > 0) {
            (allItems[currentIndex - 1] as HTMLElement)?.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
}
