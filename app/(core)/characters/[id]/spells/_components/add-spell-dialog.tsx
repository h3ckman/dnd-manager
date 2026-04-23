"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addSpell } from "@/lib/actions/spells";
import { SPELL_CATALOG, type CatalogSpell } from "@/lib/dnd";
import type { SpellSchool } from "@/lib/generated/prisma/client";

const SCHOOLS: SpellSchool[] = [
  "ABJURATION",
  "CONJURATION",
  "DIVINATION",
  "ENCHANTMENT",
  "EVOCATION",
  "ILLUSION",
  "NECROMANCY",
  "TRANSMUTATION",
];

const CUSTOM = "__custom__";

export function AddSpellDialog({ characterId }: { characterId: string }) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<string>(CUSTOM);
  const [name, setName] = useState("");
  const [level, setLevel] = useState(0);
  const [school, setSchool] = useState<SpellSchool>("EVOCATION");
  const [castingTime, setCastingTime] = useState("1 action");
  const [range, setRange] = useState("30 feet");
  const [components, setComponents] = useState("V, S");
  const [duration, setDuration] = useState("Instantaneous");
  const [description, setDescription] = useState("");
  const [pending, startTransition] = useTransition();

  const groups = useMemo(() => {
    const byLevel = new Map<number, CatalogSpell[]>();
    for (const s of SPELL_CATALOG) {
      const arr = byLevel.get(s.level) ?? [];
      arr.push(s);
      byLevel.set(s.level, arr);
    }
    return [...byLevel.entries()].sort((a, b) => a[0] - b[0]);
  }, []);

  function applyPreset(presetName: string) {
    setPreset(presetName);
    if (presetName === CUSTOM) return;
    const found = SPELL_CATALOG.find((s) => s.name === presetName);
    if (!found) return;
    setName(found.name);
    setLevel(found.level);
    setSchool(found.school);
    setCastingTime(found.castingTime);
    setRange(found.range);
    setComponents(found.components);
    setDuration(found.duration);
    setDescription(found.description);
  }

  function reset() {
    setPreset(CUSTOM);
    setName("");
    setLevel(0);
    setSchool("EVOCATION");
    setCastingTime("1 action");
    setRange("30 feet");
    setComponents("V, S");
    setDuration("Instantaneous");
    setDescription("");
  }

  function submit() {
    if (!name.trim()) {
      toast.error("Name required");
      return;
    }
    startTransition(async () => {
      const res = await addSpell(characterId, {
        name: name.trim(),
        level,
        school,
        castingTime,
        range,
        components,
        duration,
        description,
        prepared: false,
        alwaysPrepared: false,
      });
      if (res.error) toast.error(res.error);
      else {
        toast.success("Spell added");
        setOpen(false);
        reset();
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon className="size-4" />
        Add spell
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add spell</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="spell-preset">Pick from catalog</Label>
            <select
              id="spell-preset"
              value={preset}
              onChange={(e) => applyPreset(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value={CUSTOM}>Custom (enter manually)</option>
              {groups.map(([lvl, spells]) => (
                <optgroup
                  key={lvl}
                  label={lvl === 0 ? "Cantrips" : `Level ${lvl}`}
                >
                  {spells.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="spell-name">Name</Label>
            <Input
              id="spell-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="spell-level">Level</Label>
              <select
                id="spell-level"
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value, 10))}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                <option value={0}>Cantrip</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
                  <option key={n} value={n}>
                    Level {n}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="spell-school">School</Label>
              <select
                id="spell-school"
                value={school}
                onChange={(e) => setSchool(e.target.value as SpellSchool)}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                {SCHOOLS.map((s) => (
                  <option key={s} value={s}>
                    {s.charAt(0) + s.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="spell-ct">Casting time</Label>
              <Input
                id="spell-ct"
                value={castingTime}
                onChange={(e) => setCastingTime(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="spell-range">Range</Label>
              <Input
                id="spell-range"
                value={range}
                onChange={(e) => setRange(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="spell-comp">Components</Label>
              <Input
                id="spell-comp"
                value={components}
                onChange={(e) => setComponents(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="spell-dur">Duration</Label>
              <Input
                id="spell-dur"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="spell-desc">Description</Label>
            <textarea
              id="spell-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Adding…" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
