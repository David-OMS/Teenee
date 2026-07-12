import { LessonConfirmPanel } from "@/components/confirm/LessonConfirmPanel";
import { SurfaceLayout } from "@/components/layout/SurfaceLayout";

type ConfirmPageProps = {
  params: Promise<{ lessonId: string }>;
};

export default async function ConfirmPage({ params }: ConfirmPageProps) {
  const { lessonId } = await params;

  return (
    <SurfaceLayout surface="light" className="pt-2">
      <LessonConfirmPanel lessonId={lessonId} />
    </SurfaceLayout>
  );
}
