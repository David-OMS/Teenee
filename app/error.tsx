"use client";

import { ErrorState } from "@/components/ui/ErrorState";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="min-h-full bg-canvas-light px-5 py-16 text-foreground-light">
        <ErrorState
          title="Something broke"
          message={error.message || "An unexpected error occurred."}
          actionLabel="Try again"
          onAction={reset}
        />
      </body>
    </html>
  );
}
