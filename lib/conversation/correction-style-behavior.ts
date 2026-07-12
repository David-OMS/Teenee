import type { CorrectionStyle } from "@/types/user/correction-style";

type CorrectionStyleBehavior = {
  label: string;
  promptGuidance: string;
};

const behaviors: Record<CorrectionStyle, CorrectionStyleBehavior> = {
  gentle: {
    label: "Gentle",
    promptGuidance:
      "Correct with encouragement first. One small fix per turn. Never pile on errors.",
  },
  direct: {
    label: "Direct",
    promptGuidance:
      "Name the mistake clearly and give the correct form immediately. Stay brief and move on in French.",
  },
  minimal: {
    label: "Minimal",
    promptGuidance:
      "Only correct when meaning breaks down or the student asks. Prioritize flow over perfection.",
  },
};

export function getCorrectionStyleBehavior(style: CorrectionStyle): CorrectionStyleBehavior {
  return behaviors[style];
}
