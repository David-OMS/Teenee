import { ProfileHome } from "@/components/home/ProfileHome";
import { SurfaceLayout } from "@/components/layout/SurfaceLayout";

export default function HomePage() {
  return (
    <SurfaceLayout surface="light" className="pb-28 pt-2">
      <ProfileHome />
    </SurfaceLayout>
  );
}
