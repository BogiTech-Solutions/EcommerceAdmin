import * as React from 'react';

const MOBILE_BREAKPOINT = 768;
const query = `(max-width: ${MOBILE_BREAKPOINT - 1}px)`;

export function useIsMobile() {
  // 1. Define how to subscribe to the browser media query
  const subscribe = React.useCallback((callback: () => void) => {
    const mql = window.matchMedia(query);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  }, []);

  // 2. Define how to grab the current snapshot value from the DOM
  const getSnapshot = () => {
    return window.matchMedia(query).matches;
  };

  // 3. Fallback value for Server-Side Rendering (SSR) environments
  const getServerSnapshot = () => false;

  // React safely reads and synchronizes the state without cascading renders
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
