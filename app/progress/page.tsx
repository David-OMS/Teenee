import { ProgressDashboard } from "@/components/progress/ProgressDashboard";
import { SurfaceLayout } from "@/components/layout/SurfaceLayout";

export default function ProgressPage() {
  return (
    <SurfaceLayout surface="light" className="pt-2">
      <ProgressDashboard />
    </SurfaceLayout>
  );
}
