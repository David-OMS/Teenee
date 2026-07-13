"use client";

import { useEffect, useState } from "react";

import { ExportBackupSection } from "@/components/settings/ExportBackupSection";
import { TriggerPhraseEditor } from "@/components/settings/TriggerPhraseEditor";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { PrimaryButton } from "@/components/ui/PrimaryButton";
import { SelectField } from "@/components/ui/SelectField";
import { TextField } from "@/components/ui/TextField";
import { ToggleField } from "@/components/ui/ToggleField";
import { useVoiceInputMode } from "@/hooks/use-voice-input-mode";
import { useVoicePipelineMode } from "@/hooks/use-voice-pipeline-mode";
import {
  conversationModeOptions,
  getConversationModeBehavior,
} from "@/lib/conversation/conversation-mode-behavior";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useUserSettings } from "@/hooks/use-user-settings";
import type { CorrectionStyle } from "@/types/user/correction-style";

const correctionStyles: { value: CorrectionStyle; label: string }[] = [
  { value: "gentle", label: "Gentle" },
  { value: "direct", label: "Direct" },
  { value: "minimal", label: "Minimal" },
];

const cefrLevels = ["A1", "A2", "B1", "B2", "C1", "C2"].map((level) => ({
  value: level,
  label: level,
}));

/** Orchestrator — editable user preferences. */
export function SettingsPanel() {
  const { settings, isLoading, isSaving, error, save } = useUserSettings();
  const { profile, save: saveProfile, isSaving: isProfileSaving } = useUserProfile();
  const { mode: voiceInputMode, setMode: setVoiceInputMode } = useVoiceInputMode();
  const { mode: pipelineMode, setMode: setPipelineMode } = useVoicePipelineMode();
  const [draftPhrases, setDraftPhrases] = useState<string[]>([]);
  const [draftName, setDraftName] = useState("");

  useEffect(() => {
    if (settings) {
      setDraftPhrases(settings.triggerPhrases);
    }
  }, [settings]);

  useEffect(() => {
    if (profile) {
      setDraftName(profile.displayName);
    }
  }, [profile]);

  if (isLoading) {
    return <p className="px-5 text-sm text-muted-light">Loading settings…</p>;
  }

  if (!settings) {
    return <p className="px-5 text-sm text-accent">{error ?? "Settings unavailable."}</p>;
  }

  const modeBehavior = getConversationModeBehavior(settings.defaultConversationMode);
  const saving = isSaving || isProfileSaving;

  return (
    <div className="mx-5 space-y-6 pb-8">
      <div className="space-y-3">
        <FieldLabel>Your name</FieldLabel>
        <TextField
          value={draftName}
          disabled={saving}
          placeholder="Your name"
          onChange={setDraftName}
        />
        <PrimaryButton
          disabled={saving || draftName.trim().length === 0}
          onClick={() =>
            void saveProfile({ displayName: draftName.trim(), profileSetupComplete: true })
          }
        >
          Save name
        </PrimaryButton>
      </div>

      <div className="space-y-2">
        <SelectField
          label="Conversation mode"
          value={settings.defaultConversationMode}
          options={conversationModeOptions}
          disabled={saving}
          onChange={(value) => void save({ defaultConversationMode: value })}
        />
        <p className="text-xs leading-relaxed text-muted-light">{modeBehavior.description}</p>
      </div>

      <SelectField
        label="Correction style"
        value={settings.correctionStyle}
        options={correctionStyles}
        disabled={saving}
        onChange={(value) => void save({ correctionStyle: value })}
      />

      <SelectField
        label="CEFR target"
        value={settings.targetCefr}
        options={cefrLevels}
        disabled={saving}
        onChange={(value) => void save({ targetCefr: value })}
      />

      <SelectField
        label="Voice pipeline"
        value={pipelineMode}
        options={[
          { value: "budget", label: "Budget — Whisper + mini + TTS (recommended)" },
          { value: "realtime", label: "Realtime — live WebRTC (premium)" },
        ]}
        disabled={saving}
        onChange={(value) => setPipelineMode(value === "realtime" ? "realtime" : "budget")}
      />
      <p className="text-xs leading-relaxed text-muted-light">
        Budget mode costs a fraction of Realtime. Use Realtime when you want the lowest latency.
        Start a new session after changing.
      </p>

      <SelectField
        label="Voice input"
        value={voiceInputMode}
        options={[
          { value: "auto", label: "Auto — detect when you stop (Realtime only)" },
          { value: "push_to_talk", label: "Tap to talk — tap once to start, again to send" },
        ]}
        disabled={saving || pipelineMode === "budget"}
        onChange={(value) => setVoiceInputMode(value === "push_to_talk" ? "push_to_talk" : "auto")}
      />
      <p className="text-xs leading-relaxed text-muted-light">
        Auto uses silence detection (tap &quot;Done speaking&quot; in session if it waits too long).
        Tap to talk: tap Talk to record, tap Stop to send.
      </p>

      <SelectField
        label="Silence timeout (seconds)"
        value={String(settings.silenceTimeoutSeconds)}
        options={[
          { value: "1", label: "1 second — snappy" },
          { value: "2", label: "2 seconds (default)" },
          { value: "3", label: "3 seconds" },
          { value: "5", label: "5 seconds" },
        ]}
        disabled={saving || voiceInputMode === "push_to_talk" || pipelineMode === "budget"}
        onChange={(value) => void save({ silenceTimeoutSeconds: Number(value) })}
      />

      <ToggleField
        label="Show transcript during practice"
        description="Hidden by default — swipe up later in session UI."
        checked={settings.transcriptVisible}
        disabled={saving}
        onChange={(checked) => void save({ transcriptVisible: checked })}
      />

      <TriggerPhraseEditor phrases={draftPhrases} disabled={saving} onChange={setDraftPhrases} />

      <PrimaryButton
        disabled={saving}
        onClick={() =>
          void save({
            triggerPhrases: draftPhrases.filter((phrase) => phrase.trim().length > 0),
          })
        }
      >
        Save trigger phrases
      </PrimaryButton>

      <ExportBackupSection />

      {error ? <p className="text-sm text-accent">{error}</p> : null}
      {saving ? <p className="text-xs text-muted-light">Saving…</p> : null}
    </div>
  );
}
