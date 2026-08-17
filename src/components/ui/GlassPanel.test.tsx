import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassPanel } from './GlassPanel';
import React from 'react';

describe('GlassPanel', () => {
  it('renders children correctly', () => {
    render(
      <GlassPanel>
        <span data-testid="test-child">Hello World</span>
      </GlassPanel>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <GlassPanel className="custom-class-123">
        <div>Child</div>
      </GlassPanel>
    );
    expect(container.firstChild).toHaveClass('custom-class-123');
  });

  it('applies correct padding styles based on noPadding prop', () => {
    const { container: containerWithPadding } = render(
      <GlassPanel noPadding={false}>
        <div>Child</div>
      </GlassPanel>
    );
    expect(containerWithPadding.firstChild).toHaveClass('p-6');

    const { container: containerNoPadding } = render(
      <GlassPanel noPadding={true}>
        <div>Child</div>
      </GlassPanel>
    );
    expect(containerNoPadding.firstChild).not.toHaveClass('p-6');
  });

  it('applies glow styles correctly', () => {
    const { container } = render(
      <GlassPanel glow="red">
        <div>Child</div>
      </GlassPanel>
    );
    expect(container.firstChild).toHaveClass('shadow-red-glow');
  });
});
