"use client";

import { Label } from "@/components/ui/label";
import { useDraft } from "../wizard-context";
import { WizardShell } from "../wizard-shell";

const TRAIT_FIELDS = [
  { key: "personality", label: "Personality traits", placeholder: "Quirks, mannerisms, attitudes…" },
  { key: "ideals", label: "Ideals", placeholder: "What you stand for or believe in." },
  { key: "bonds", label: "Bonds", placeholder: "People, places, or things tied to you." },
  { key: "flaws", label: "Flaws", placeholder: "Weaknesses, vices, lingering regrets." },
  { key: "appearance", label: "Appearance", placeholder: "Physical description and dress." },
  { key: "backstory", label: "Backstory", placeholder: "Where you come from, what brought you here." },
] as const;

export function TraitsStep() {
  const { draft, patchIdentity } = useDraft();

  return (
    <WizardShell step="traits">
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          All optional — you can flesh these out later.
        </p>
        {TRAIT_FIELDS.map((f) => (
          <div key={f.key} className="flex flex-col gap-2">
            <Label htmlFor={`trait-${f.key}`}>{f.label}</Label>
            <textarea
              id={`trait-${f.key}`}
              value={draft.identity[f.key] ?? ""}
              onChange={(e) => patchIdentity({ [f.key]: e.target.value })}
              placeholder={f.placeholder}
              rows={2}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        ))}
      </div>
    </WizardShell>
  );
}
