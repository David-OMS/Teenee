import type { PracticeGraph } from "@/types/practice-graph/practice-graph";

export type PracticeGraphSnapshot = Pick<
  PracticeGraph,
  "id" | "lessonId" | "nodes" | "pronunciationFocus"
>;
