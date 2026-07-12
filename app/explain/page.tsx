import { ExplainSessionPanel } from "@/components/session/ExplainSessionPanel";
import { SurfaceLayout } from "@/components/layout/SurfaceLayout";

export default function ExplainPage() {
  return (
    <SurfaceLayout surface="dark" className="min-h-full">
      <ExplainSessionPanel />
    </SurfaceLayout>
  );
}
