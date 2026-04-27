"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ALIGNMENTS,
  BACKGROUNDS,
  CLASSES,
  RACES,
  getClass,
  getRace,
} from "@/lib/dnd";
import { PortraitPicker } from "../../../../_components/portrait-picker";
import { useDraft } from "../wizard-context";
import { usePresetPortraits } from "../portrait-presets-context";
import { WizardShell } from "../wizard-shell";

export function IdentityStep() {
  const { draft, patchIdentity } = useDraft();
  const presetsCtx = usePresetPortraits();
  const presets = [...presetsCtx];
  const { identity } = draft;

  const subraces = useMemo(
    () => getRace(identity.race)?.subraces ?? [],
    [identity.race],
  );
  const subclasses = useMemo(
    () => getClass(identity.characterClass)?.subclasses ?? [],
    [identity.characterClass],
  );

  const nextDisabled = !identity.name.trim();

  return (
    <WizardShell step="identity" nextDisabled={nextDisabled}>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label>Portrait</Label>
          <PortraitPicker
            value={identity.portraitUrl ?? null}
            onChange={(v) => patchIdentity({ portraitUrl: v ?? undefined })}
            presets={presets}
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="std-name">Name</Label>
          <Input
            id="std-name"
            value={identity.name}
            onChange={(e) => patchIdentity({ name: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="std-race">Race</Label>
            <select
              id="std-race"
              value={identity.race}
              onChange={(e) =>
                patchIdentity({ race: e.target.value, subrace: undefined })
              }
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              {RACES.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="std-subrace">Subrace</Label>
            <select
              id="std-subrace"
              value={identity.subrace ?? ""}
              onChange={(e) =>
                patchIdentity({ subrace: e.target.value || undefined })
              }
              disabled={subraces.length === 0}
              className="rounded-md border bg-background px-3 py-2 text-sm disabled:opacity-50"
            >
              <option value="">—</option>
              {subraces.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="std-class">Class</Label>
            <select
              id="std-class"
              value={identity.characterClass}
              onChange={(e) =>
                patchIdentity({
                  characterClass: e.target.value,
                  subclass: undefined,
                })
              }
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              {CLASSES.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="std-subclass">Subclass</Label>
            <select
              id="std-subclass"
              value={identity.subclass ?? ""}
              onChange={(e) =>
                patchIdentity({ subclass: e.target.value || undefined })
              }
              disabled={subclasses.length === 0}
              className="rounded-md border bg-background px-3 py-2 text-sm disabled:opacity-50"
            >
              <option value="">—</option>
              {subclasses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="std-bg">Background</Label>
            <select
              id="std-bg"
              value={identity.background}
              onChange={(e) => patchIdentity({ background: e.target.value })}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              {BACKGROUNDS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="std-align">Alignment</Label>
            <select
              id="std-align"
              value={identity.alignment}
              onChange={(e) => patchIdentity({ alignment: e.target.value })}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              {ALIGNMENTS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </WizardShell>
  );
}
