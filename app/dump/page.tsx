import { ClassDumpPanel } from "@/components/dump/ClassDumpPanel";
import { SurfaceLayout } from "@/components/layout/SurfaceLayout";

export default function DumpPage() {
  return (
    <SurfaceLayout surface="dark">
      <ClassDumpPanel />
    </SurfaceLayout>
  );
}
