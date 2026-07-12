import { Suspense } from "react";

import { PracticeSessionPanel } from "@/components/session/PracticeSessionPanel";
import { SurfaceLayout } from "@/components/layout/SurfaceLayout";

export default function PracticePage() {
  return (
    <SurfaceLayout surface="dark" className="min-h-full">
      <Suspense fallback={<p className="px-8 text-sm text-muted-dark">Loading…</p>}>
        <PracticeSessionPanel />
      </Suspense>
    </SurfaceLayout>
  );
}
