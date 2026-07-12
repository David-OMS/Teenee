import type { PracticeTemplate } from "@/types/practice-template/practice-template";
import type { TemplateInstantiationInput } from "@/types/practice-template/template-instantiation-input";

export function scoreTemplateMatch(
  template: PracticeTemplate,
  input: TemplateInstantiationInput,
): number {
  const haystack = [
    input.lessonTitle,
    ...input.vocabulary.map((item) => `${item.french} ${item.english}`),
    ...input.expressions.map((item) => `${item.french} ${item.english}`),
    ...input.grammar.map((item) => `${item.topic} ${item.description}`),
  ]
    .join(" ")
    .toLowerCase();

  return template.matchKeywords.reduce((score, keyword) => {
    return haystack.includes(keyword.toLowerCase()) ? score + 1 : score;
  }, 0);
}
