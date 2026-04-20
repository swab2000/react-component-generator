import { useState } from 'react';

export type ViewportSize = 'mobile' | 'tablet' | 'desktop';

export const VIEWPORT_WIDTHS: Record<ViewportSize, string> = {
  mobile: '375px',
  tablet: '768px',
  desktop: '100%',
};

export function useViewportSize() {
  const [viewportSize, setViewportSize] = useState<ViewportSize>('desktop');

  return {
    viewportSize,
    setViewportSize,
    width: VIEWPORT_WIDTHS[viewportSize],
  };
}
