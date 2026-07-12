"use client";

import { useState } from "react";

import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { FieldLabel } from "@/components/ui/FieldLabel";

export function ExportBackupSection() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleExport() {
    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch("/api/export");
      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "Export failed.");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `teenee-backup-${new Date().toISOString().slice(0, 10)}.json`;
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (exportError) {
      setError(exportError instanceof Error ? exportError.message : "Export failed.");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="space-y-3 border-t border-border-light pt-6">
      <FieldLabel>Backup</FieldLabel>
      <p className="text-xs leading-relaxed text-muted-light">
        Download lessons, knowledge graph, and session history as JSON.
      </p>
      <PrimaryButton disabled={isExporting} onClick={() => void handleExport()}>
        {isExporting ? "Exporting…" : "Export backup"}
      </PrimaryButton>
      {error ? <p className="text-sm text-accent">{error}</p> : null}
    </div>
  );
}
