import { PageHeader } from "@/components/layout/PageHeader";
import { SettingsPanel } from "@/components/settings/SettingsPanel";
import { SurfaceLayout } from "@/components/layout/SurfaceLayout";

export default function SettingsPage() {
  return (
    <SurfaceLayout surface="light" className="pt-2">
      <PageHeader title="Settings" subtitle="Tune how Teenee talks, listens, and corrects." display />
      <SettingsPanel />
    </SurfaceLayout>
  );
}
