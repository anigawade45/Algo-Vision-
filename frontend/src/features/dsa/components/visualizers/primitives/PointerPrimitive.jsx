import React from 'react';
import { PointerLabel } from './PointerLabel';

/**
 * PointerPrimitive — Reusable Primitive for Pointer Tracking
 * Renders named pointer indicators (e.g. i, j, left, right, top, front, rear, head, prev, curr, next).
 * Presentational, deterministic, and algorithm-agnostic.
 */
export function PointerPrimitive({
  name = 'pointer',
  color = 'blue',
  position = 'top', // 'top' | 'bottom'
  className = '',
}) {
  if (!name) return null;

  return (
    <div className={`shrink-0 ${className}`}>
      <PointerLabel label={name} color={color} position={position} />
    </div>
  );
}
