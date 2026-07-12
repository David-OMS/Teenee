export type TemplateId =
  | "greeting_flow"
  | "classroom_objects_flow"
  | "explain_lesson_flow";

export type TemplateSlotKind =
  | "open"
  | "respond"
  | "ask_back"
  | "register_switch"
  | "variation"
  | "close"
  | "pick_object"
  | "ask_what"
  | "student_answers"
  | "student_asks"
  | "ai_answers"
  | "introduce_new"
  | "student_explains"
  | "correct_misunderstanding";
