import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatusBadge } from './StatusBadge';
import React from 'react';

describe('StatusBadge', () => {
  it('renders critical status correctly with default label', () => {
    render(<StatusBadge status="critical" />);
    const badge = screen.getByText('CRITICAL');
    expect(badge).toBeInTheDocument();
  });

  it('renders custom label when provided', () => {
    render(<StatusBadge status="normal" label="All Good" />);
    const badge = screen.getByText('All Good');
    expect(badge).toBeInTheDocument();
    expect(screen.queryByText('NORMAL')).toBeNull();
  });

  it('applies pulse class when pulse is true', () => {
    const { container } = render(<StatusBadge status="high" pulse={true} />);
    const dot = container.querySelector('.animate-pulse');
    expect(dot).toBeInTheDocument();
  });
});
