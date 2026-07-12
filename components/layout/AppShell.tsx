import { BottomNav } from "@/components/layout/BottomNav";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <>
      <div className="mx-auto flex min-h-full w-full max-w-lg flex-1 flex-col pb-20">
        {children}
      </div>
      <BottomNav />
    </>
  );
}
