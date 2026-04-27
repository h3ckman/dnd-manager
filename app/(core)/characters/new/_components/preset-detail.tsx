"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ABILITY_LABELS,
  ABILITY_NAMES,
  abilityModifier,
  formatModifier,
} from "@/lib/dnd";
import { createCharacterFromPreset } from "@/lib/actions/characters";
import type { CharacterDraft } from "@/lib/characters/draft-types";

export function PresetDetail({
  presetId,
  presetName,
  archetype,
  draft,
}: {
  presetId: string;
  presetName: string;
  archetype: string;
  draft: CharacterDraft;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(draft.identity.name);

  function onConfirm() {
    startTransition(async () => {
      const res = await createCharacterFromPreset(presetId, {
        name: name.trim() || undefined,
      });
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Character created");
      router.push("/characters");
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{presetName}</h1>
            <Badge variant="outline" className="capitalize">
              {archetype}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Level 1 {draft.identity.race}
            {draft.identity.subrace ? ` (${draft.identity.subrace})` : ""}{" "}
            {draft.identity.characterClass}
            {draft.identity.subclass ? ` — ${draft.identity.subclass}` : ""}
            {" · "}
            {draft.identity.background} · {draft.identity.alignment}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ability scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {ABILITY_NAMES.map((a) => (
                <div
                  key={a}
                  className="flex justify-between rounded border bg-muted/30 px-2 py-1"
                >
                  <span className="font-medium">{ABILITY_LABELS[a]}</span>
                  <span>
                    {draft.abilities[a]} (
                    {formatModifier(abilityModifier(draft.abilities[a]))})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill proficiencies</CardTitle>
            <CardDescription>
              {draft.skillProficiencies.length} skills
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {draft.skillProficiencies.length === 0 ? (
              <span className="text-muted-foreground">None</span>
            ) : (
              <ul className="grid grid-cols-2 gap-x-4">
                {draft.skillProficiencies.map((s) => (
                  <li key={s} className="capitalize">
                    {s.toLowerCase().replace(/_/g, " ")}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Starting equipment</CardTitle>
            <CardDescription>
              {draft.inventory.length} item{draft.inventory.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="flex flex-col gap-1">
              {draft.inventory.map((it, i) => (
                <li key={`${it.name}-${i}`} className="flex justify-between">
                  <span>{it.name}</span>
                  {(it.quantity ?? 1) > 1 && (
                    <span className="text-muted-foreground">×{it.quantity}</span>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spells</CardTitle>
            <CardDescription>
              {draft.spells.length} spell{draft.spells.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {draft.spells.length === 0 ? (
              <span className="text-muted-foreground">No spells</span>
            ) : (
              <ul className="flex flex-col gap-1">
                {draft.spells.map((s) => (
                  <li key={s.name} className="flex justify-between">
                    <span>{s.name}</span>
                    <span className="text-muted-foreground">
                      {s.level === 0 ? "cantrip" : `lv ${s.level}`}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Class features</CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            <ul className="flex flex-col gap-2">
              {draft.features.map((f) => (
                <li key={f.name}>
                  <span className="font-medium">{f.name}</span>{" "}
                  <span className="text-xs text-muted-foreground">({f.source})</span>
                  <p className="text-muted-foreground">{f.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customize before creating</CardTitle>
          <CardDescription>
            You can rename now or change anything later from the sheet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:max-w-sm">
            <Label htmlFor="preset-name">Character name</Label>
            <Input
              id="preset-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/characters/new/premade")}
        >
          Back
        </Button>
        <Button type="button" onClick={onConfirm} disabled={pending || !name.trim()}>
          {pending ? "Creating…" : "Create character"}
        </Button>
      </div>
    </div>
  );
}
