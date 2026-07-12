"use client";

import { useOnlineStatus } from "@/hooks/use-online-status";

export function OfflineBanner() {
  const online = useOnlineStatus();

  if (online) {
    return null;
  }

  return (
    <div
      role="status"
      className="fixed inset-x-0 top-0 z-[60] bg-accent px-4 py-2 text-center text-xs font-medium text-white"
    >
      You&apos;re offline — voice sessions need a connection. Cached pages still work.
    </div>
  );
}
