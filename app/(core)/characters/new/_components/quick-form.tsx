"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { ShuffleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ABILITY_LABELS,
  ABILITY_NAMES,
  ALIGNMENTS,
  BACKGROUNDS,
  BACKGROUND_GRANTS,
  CLASS_EQUIPMENT_BUNDLES,
  CLASSES,
  LEVEL1_SUGGESTED,
  RACES,
  STANDARD_ARRAY,
  assignScoresForClass,
  formatModifier,
  abilityModifier,
  getRace,
} from "@/lib/dnd";
import { createQuickCharacter } from "@/lib/actions/characters";
import { randomCharacterName } from "@/lib/characters/random-names";

const DEFAULT_CLASS = CLASSES[0].name;
const DEFAULT_RACE = RACES[0].name;
const DEFAULT_BG = "Folk Hero";

export function QuickForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [characterClass, setCharacterClass] = useState(DEFAULT_CLASS);
  const [race, setRace] = useState(DEFAULT_RACE);
  const [subrace, setSubrace] = useState("");
  const [background, setBackground] = useState(DEFAULT_BG);
  const [alignment, setAlignment] = useState("True Neutral");

  const classDef = useMemo(
    () => CLASSES.find((c) => c.name === characterClass),
    [characterClass],
  );
  const raceDef = useMemo(() => getRace(race), [race]);

  const abilities = useMemo(() => {
    if (!classDef) return null;
    return assignScoresForClass(STANDARD_ARRAY, classDef);
  }, [classDef]);

  const equipmentBundle = CLASS_EQUIPMENT_BUNDLES[characterClass]?.[0];
  const backgroundGrant = BACKGROUND_GRANTS[background];
  const spells = LEVEL1_SUGGESTED[characterClass];

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await createQuickCharacter(undefined, formData);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Character created");
      router.push("/characters");
    });
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="quick-name">Name</Label>
            <div className="flex gap-2">
              <Input
                id="quick-name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => setName(randomCharacterName())}
                title="Randomize name"
              >
                <ShuffleIcon className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="quick-class">Class</Label>
              <select
                id="quick-class"
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
              <Label htmlFor="quick-race">Race</Label>
              <select
                id="quick-race"
                name="race"
                value={race}
                onChange={(e) => {
                  setRace(e.target.value);
                  setSubrace("");
                }}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                {RACES.map((r) => (
                  <option key={r.name} value={r.name}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {raceDef && raceDef.subraces.length > 0 && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="quick-subrace">Subrace</Label>
              <select
                id="quick-subrace"
                name="subrace"
                value={subrace}
                onChange={(e) => setSubrace(e.target.value)}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value="">—</option>
                {raceDef.subraces.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="quick-bg">Background</Label>
              <select
                id="quick-bg"
                name="background"
                value={background}
                onChange={(e) => setBackground(e.target.value)}
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
              <Label htmlFor="quick-align">Alignment</Label>
              <select
                id="quick-align"
                name="alignment"
                value={alignment}
                onChange={(e) => setAlignment(e.target.value)}
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

        <div className="flex flex-col gap-4 rounded-lg border bg-muted/30 p-4">
          <div>
            <h3 className="font-medium">What we&apos;ll fill in</h3>
            <p className="text-xs text-muted-foreground">
              Sensible defaults based on your class and background. Edit anything from the sheet after.
            </p>
          </div>

          {abilities && (
            <div>
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Ability scores (standard array)
              </div>
              <div className="mt-1 grid grid-cols-3 gap-2 text-sm">
                {ABILITY_NAMES.map((a) => (
                  <div key={a} className="flex justify-between rounded border bg-background px-2 py-1">
                    <span className="font-medium">{ABILITY_LABELS[a]}</span>
                    <span>
                      {abilities[a]} ({formatModifier(abilityModifier(abilities[a]))})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {equipmentBundle && (
            <div>
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Starting equipment
              </div>
              <p className="mt-1 text-sm">
                <span className="font-medium">{equipmentBundle.label}</span>
                {equipmentBundle.description && (
                  <span className="text-muted-foreground"> — {equipmentBundle.description}</span>
                )}
              </p>
            </div>
          )}

          {backgroundGrant && (
            <div>
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Background grants
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Skills:{" "}
                {backgroundGrant.skills
                  .map((s) => s.replace(/_/g, " ").toLowerCase())
                  .join(", ")}
              </p>
            </div>
          )}

          {spells && (
            <div>
              <div className="text-xs font-medium uppercase text-muted-foreground">
                Starting spells
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {spells.cantripCap} cantrips + {spells.spellCap} level-1 spells
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/characters/new")}
        >
          Back
        </Button>
        <Button type="submit" disabled={pending || !name.trim()}>
          {pending ? "Creating…" : "Create character"}
        </Button>
      </div>
    </form>
  );
}
