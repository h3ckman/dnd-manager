"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { createCharacter } from "@/lib/actions/characters";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";
import {
  ALIGNMENTS,
  BACKGROUNDS,
  CLASSES,
  RACES,
  getRace,
  getClass,
} from "@/lib/dnd";
import { PortraitPicker } from "./portrait-picker";
import type { PresetPortrait } from "@/lib/characters/portraits";

export function CreateCharacterDialog({
  presets,
}: {
  presets: PresetPortrait[];
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const [race, setRace] = useState(RACES[0].name);
  const [characterClass, setCharacterClass] = useState(CLASSES[0].name);
  const [portraitUrl, setPortraitUrl] = useState<string | null>(null);

  const subraces = useMemo(() => getRace(race)?.subraces ?? [], [race]);
  const subclasses = useMemo(
    () => getClass(characterClass)?.subclasses ?? [],
    [characterClass],
  );

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await createCharacter(undefined, formData);
      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Character created");
        setOpen(false);
        setPortraitUrl(null);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon className="size-4" />
        New character
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create character</DialogTitle>
          <DialogDescription>
            Start a new level 1 adventurer. You can customize stats and
            inventory after creation.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="flex flex-col gap-4">
          <input type="hidden" name="portraitUrl" value={portraitUrl ?? ""} />
          <div className="flex flex-col gap-2">
            <Label>Portrait</Label>
            <PortraitPicker
              value={portraitUrl}
              onChange={setPortraitUrl}
              presets={presets}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="char-name">Name</Label>
            <Input id="char-name" name="name" required />
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
                defaultValue="Folk Hero"
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
                defaultValue="True Neutral"
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
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
