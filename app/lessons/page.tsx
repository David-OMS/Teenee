import { LessonListPanel } from "@/components/lessons/LessonListPanel";
import { SurfaceLayout } from "@/components/layout/SurfaceLayout";

export default function LessonsPage() {
  return (
    <SurfaceLayout surface="light" className="pt-2">
      <LessonListPanel />
    </SurfaceLayout>
  );
}
