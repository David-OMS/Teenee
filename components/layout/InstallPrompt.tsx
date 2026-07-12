"use client";

import { useInstallPrompt } from "@/hooks/use-install-prompt";

export function InstallPrompt() {
  const { canInstall, install, dismiss } = useInstallPrompt();

  if (!canInstall) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-[calc(5rem+env(safe-area-inset-bottom))] z-[55] mx-4">
      <div className="flex items-center justify-between gap-3 rounded-2xl bg-canvas-dark px-4 py-3 shadow-lg">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground-dark">Install Teenee</p>
          <p className="text-xs text-muted-dark">Add to your home screen for quick access.</p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={dismiss}
            className="h-9 rounded-full px-3 text-xs font-medium text-muted-dark"
          >
            Not now
          </button>
          <button
            type="button"
            onClick={() => void install()}
            className="h-9 rounded-full bg-accent px-4 text-xs font-semibold text-white"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
}
