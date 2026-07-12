/**
 * How the AI speaks during practice — audio behavior, not UI layout.
 *
 * - hybrid: French-first conversation. English only on confusion, correction, or brief praise.
 * - beginner: More English scaffolding, still French-led.
 * - immersion: French only unless student asks or is clearly lost.
 */
export type ConversationMode = "beginner" | "hybrid" | "immersion";
