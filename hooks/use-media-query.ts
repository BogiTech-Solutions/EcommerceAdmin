import { useSyncExternalStore, useCallback } from 'react';

const QUERY = '(max-width: 768px)';

export function useMediaQuery() {
  // Subscribe to changes in the media query layout
  const subscribe = useCallback((callback: () => void) => {
    const mediaQuery = window.matchMedia(QUERY);
    mediaQuery.addEventListener('change', callback);
    return () => mediaQuery.removeEventListener('change', callback);
  }, []);

  // Fetch the instantaneous state directly from the DOM
  const getSnapshot = useCallback(() => {
    return window.matchMedia(QUERY).matches;
  }, []);

  // Use false as a placeholder value for Server-Side Rendering (SSR)
  const getServerSnapshot = () => false;

  const isOpen = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  return { isOpen };
}
