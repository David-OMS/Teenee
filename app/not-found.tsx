import Link from "next/link";

import { PageHeader } from "@/components/layout/PageHeader";
import { SurfaceLayout } from "@/components/layout/SurfaceLayout";
import { PrimaryButton } from "@/components/ui/PrimaryButton";

export default function NotFoundPage() {
  return (
    <SurfaceLayout surface="light" className="pt-2">
      <PageHeader title="Not found" subtitle="This page doesn't exist in Teenee." display />
      <div className="mx-5 mt-8">
        <Link href="/">
          <PrimaryButton>Back home</PrimaryButton>
        </Link>
      </div>
    </SurfaceLayout>
  );
}
