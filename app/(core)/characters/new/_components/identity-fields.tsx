"use client";

import { useMemo, useState } from "react";
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
import { PortraitPicker } from "../../_components/portrait-picker";
import type { PresetPortrait } from "@/lib/characters/portraits";

export type IdentityFieldsProps = {
  presets: PresetPortrait[];
  defaultName?: string;
  defaultClass?: string;
  defaultRace?: string;
  defaultBackground?: string;
  defaultAlignment?: string;
  showPortrait?: boolean;
};

export function IdentityFields({
  presets,
  defaultName = "",
  defaultClass = CLASSES[0].name,
  defaultRace = RACES[0].name,
  defaultBackground = "Folk Hero",
  defaultAlignment = "True Neutral",
  showPortrait = true,
}: IdentityFieldsProps) {
  const [race, setRace] = useState(defaultRace);
  const [characterClass, setCharacterClass] = useState(defaultClass);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);

  const subraces = useMemo(() => getRace(race)?.subraces ?? [], [race]);
  const subclasses = useMemo(
    () => getClass(characterClass)?.subclasses ?? [],
    [characterClass],
  );

  return (
    <div className="flex flex-col gap-4">
      {showPortrait && (
        <>
          <input type="hidden" name="portraitUrl" value={portraitUrl ?? ""} />
          <div className="flex flex-col gap-2">
            <Label>Portrait</Label>
            <PortraitPicker
              value={portraitUrl}
              onChange={setPortraitUrl}
              presets={presets}
            />
          </div>
        </>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="char-name">Name</Label>
        <Input id="char-name" name="name" defaultValue={defaultName} required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="char-race">Race</Label>
          <select
            id="char-race"
            name="race"
            value={race}
            onChange={(e) => setRace(e.target.value)}
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
          <Label htmlFor="char-subrace">Subrace</Label>
          <select
            id="char-subrace"
            name="subrace"
            disabled={subraces.length === 0}
            defaultValue=""
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
          <Label htmlFor="char-class">Class</Label>
          <select
            id="char-class"
            name="characterClass"
            value={characterClass}
            onChange={(e) => setCharacterClass(e.target.value)}
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
          <Label htmlFor="char-subclass">Subclass</Label>
          <select
            id="char-subclass"
            name="subclass"
            disabled={subclasses.length === 0}
            defaultValue=""
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
          <Label htmlFor="char-bg">Background</Label>
          <select
            id="char-bg"
            name="background"
            defaultValue={defaultBackground}
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
          <Label htmlFor="char-align">Alignment</Label>
          <select
            id="char-align"
            name="alignment"
            defaultValue={defaultAlignment}
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
  );
}
