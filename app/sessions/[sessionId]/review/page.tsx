import { SessionReviewPanel } from "@/components/session/SessionReviewPanel";
import { SurfaceLayout } from "@/components/layout/SurfaceLayout";

type ReviewPageProps = {
  params: Promise<{ sessionId: string }>;
};

export default async function SessionReviewPage({ params }: ReviewPageProps) {
  const { sessionId } = await params;

  return (
    <SurfaceLayout surface="light" className="pt-2">
      <SessionReviewPanel sessionId={sessionId} />
    </SurfaceLayout>
  );
}
