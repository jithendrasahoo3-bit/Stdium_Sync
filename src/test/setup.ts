import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock scrollIntoView since JSDOM does not implement layout methods
window.HTMLElement.prototype.scrollIntoView = vi.fn();
