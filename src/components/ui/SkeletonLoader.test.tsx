import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { SkeletonLoader, SkeletonLine, SkeletonCard } from './SkeletonLoader';
import React from 'react';

describe('SkeletonLoader components', () => {
  it('renders correct number of lines in SkeletonLoader', () => {
    const { container } = render(<SkeletonLoader lines={5} />);
    const lines = container.querySelectorAll('.animate-shimmer');
    expect(lines.length).toBe(5);
  });

  it('renders SkeletonLine with shimmers', () => {
    const { container } = render(<SkeletonLine className="test-line" />);
    const shimmers = container.querySelectorAll('.test-line');
    expect(shimmers.length).toBe(1);
  });

  it('renders SkeletonCard with custom class', () => {
    const { container } = render(<SkeletonCard className="custom-card" />);
    const card = container.querySelector('.custom-card');
    expect(card).toBeInTheDocument();
  });
});
