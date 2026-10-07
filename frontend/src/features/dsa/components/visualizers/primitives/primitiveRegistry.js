import { ArrayPrimitive } from './ArrayPrimitive';
import { PointerPrimitive } from './PointerPrimitive';
import { HeapPrimitive } from './HeapPrimitive';
import { StackPrimitive } from './StackPrimitive';
import { QueuePrimitive } from './QueuePrimitive';
import { GridPrimitive } from './GridPrimitive';
import { MatrixPrimitive } from './MatrixPrimitive';
import { LinkedListPrimitive } from './LinkedListPrimitive';
import { TreePrimitive } from './TreePrimitive';
import { ResourcePrimitive } from './ResourcePrimitive';
import { VariablePrimitive } from './VariablePrimitive';
import { semanticHighlights } from './semanticHighlights';

/**
 * Primitive Registry — AlgoVision Visualization Primitive Architecture
 * Maps primitive type identifiers to reusable presentational primitive components.
 */
export const primitiveRegistry = {
  array: ArrayPrimitive,
  pointer: PointerPrimitive,
  heap: HeapPrimitive,
  stack: StackPrimitive,
  queue: QueuePrimitive,
  grid: GridPrimitive,
  matrix: MatrixPrimitive,
  linkedList: LinkedListPrimitive,
  tree: TreePrimitive,
  resource: ResourcePrimitive,
  variable: VariablePrimitive,
  highlight: semanticHighlights,
};

/**
 * Helper to get a primitive component by type name
 * Returns null if primitive type is not registered.
 */
export function getPrimitiveComponent(type) {
  if (!type) return null;
  return primitiveRegistry[type] || null;
}
