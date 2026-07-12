import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { SurfaceLayout } from "@/components/layout/SurfaceLayout";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export default function LoginPage() {
  return (
    <SurfaceLayout surface="light" className="pt-2">
      <PageHeader
        title="Teenee"
        subtitle="V1 runs in single-user dev mode — one learner profile on this device."
        display
      />
      <div className="mx-5 mt-8 space-y-4 text-center">
        <p className="text-sm leading-relaxed text-muted-light">
          No sign-in required for local testing. Your profile is created automatically on first use.
        </p>
        <Link href="/">
          <PrimaryButton>Continue</PrimaryButton>
        </Link>
      </div>
    </SurfaceLayout>
  );
}
