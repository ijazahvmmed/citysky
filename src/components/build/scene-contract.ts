export type Completion = "canvas" | "essentials" | "pinnacle";

/** Stable adapter boundary: a grouped GLB can replace the procedural study. */
export interface BuildingScene {
  setProgress: (progress: number) => void;
  setCompletion: (completion: Completion | null) => void;
  dispose: () => void;
}

export const constructionStages = [
  { title: "Imagine", copy: "Every home begins with the possibilities of a place." },
  { title: "Plan", copy: "An idea takes its place on the ground." },
  { title: "Build", copy: "A carefully engineered structure rises, level by level." },
  { title: "Shape", copy: "Rooms, openings and light give the home its character." },
  { title: "Finish", copy: "Materials and considered details bring it together." },
  { title: "Live", copy: "From empty land to a home of your own." },
] as const;
