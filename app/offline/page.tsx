import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { SurfaceLayout } from "@/components/layout/SurfaceLayout";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export default function OfflinePage() {
  return (
    <SurfaceLayout surface="light" className="pt-2">
      <PageHeader title="Offline" subtitle="Reconnect to dump, speak, or sync progress." display />
      <div className="mx-5 mt-8 space-y-4 text-center">
        <p className="text-sm leading-relaxed text-muted-light">
          Teenee needs the internet for voice sessions and AI parsing. Your installed app shell is
          still available.
        </p>
        <Link href="/">
          <PrimaryButton>Back home</PrimaryButton>
        </Link>
      </div>
    </SurfaceLayout>
  );
}
