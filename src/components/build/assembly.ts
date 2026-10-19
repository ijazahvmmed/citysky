/** Pure, reversible timeline helpers shared by geometry, materials and camera. */
export function phase(progress: number, start: number, end: number) {
  const t = Math.max(0, Math.min(1, (progress - start) / (end - start)));
  return t * t * (3 - 2 * t);
}

export type AssemblyPart = {
  position: [number, number, number];
  size: [number, number, number];
  axis: 0 | 1 | 2;
  start: number;
  end: number;
  settle?: number;
};

/** The growing edge moves; the foundation/slab/left-hand origin stays fixed. */
export function assemblyTransform(part: AssemblyPart, progress: number) {
  const t = phase(progress, part.start, part.end);
  const size: [number, number, number] = [...part.size];
  const position: [number, number, number] = [...part.position];
  size[part.axis] *= t;
  position[part.axis] -= (part.size[part.axis] - size[part.axis]) / 2;
  position[1] += (part.settle ?? 0) * (1 - t);
  return { size, position, visible: t > 0 };
}
