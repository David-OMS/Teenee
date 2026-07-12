import type { LessonStatus } from "@/types/lesson/lesson-status";

const statusLabels: Record<LessonStatus, string> = {
  draft: "Draft",
  parsed: "Needs review",
  confirmed: "Confirmed",
};

type LessonStatusBadgeProps = {
  status: LessonStatus;
};

export function LessonStatusBadge({ status }: LessonStatusBadgeProps) {
  const isConfirmed = status === "confirmed";

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${
        isConfirmed ? "bg-accent/10 text-accent" : "bg-surface-light text-muted-light"
      }`}
    >
      {statusLabels[status]}
    </span>
  );
}
