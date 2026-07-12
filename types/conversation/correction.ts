export type Correction = {
  type: "grammar" | "pronunciation";
  original: string;
  corrected: string;
  explanation?: string;
};
