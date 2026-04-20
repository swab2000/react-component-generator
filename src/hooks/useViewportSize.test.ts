import { describe, it, expect } from 'vitest';
import { VIEWPORT_WIDTHS } from './useViewportSize';

describe('VIEWPORT_WIDTHS', () => {
  it('mobile은 375px이어야 함', () => {
    expect(VIEWPORT_WIDTHS.mobile).toBe('375px');
  });

  it('tablet은 768px이어야 함', () => {
    expect(VIEWPORT_WIDTHS.tablet).toBe('768px');
  });

  it('desktop은 100%이어야 함', () => {
    expect(VIEWPORT_WIDTHS.desktop).toBe('100%');
  });
});
