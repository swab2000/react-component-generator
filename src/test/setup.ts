import '@testing-library/jest-dom';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import { TextEncoder, TextDecoder } from 'util';

// Add TextEncoder/TextDecoder to global scope for happy-dom
Object.assign(global, { TextEncoder, TextDecoder });

afterEach(() => {
  cleanup();
});
