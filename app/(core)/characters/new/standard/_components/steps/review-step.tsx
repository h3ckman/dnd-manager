"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ABILITY_LABELS,
  ABILITY_NAMES,
  SKILL_BY_NAME,
  abilityModifier,
  formatModifier,
} from "@/lib/dnd";
import { createStandardCharacter } from "@/lib/actions/characters";
import { useDraft } from "../wizard-context";
import { WizardShell } from "../wizard-shell";

export function ReviewStep() {
  const router = useRouter();
  const { draft, reset } = useDraft();
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const res = await createStandardCharacter(draft);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Character created");
      reset();
      router.push("/characters");
    });
  }

  const id = draft.identity;

  return (
    <WizardShell step="review" onSubmit={onSubmit} submitting={pending}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{id.name || "Unnamed character"}</CardTitle>
            <CardDescription>
              Level 1 {id.race}{id.subrace ? ` (${id.subrace})` : ""} {id.characterClass}
              {id.subclass ? ` — ${id.subclass}` : ""} · {id.background} · {id.alignment}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ability scores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-2 text-sm">
              {ABILITY_NAMES.map((a) => (
                <div key={a} className="flex justify-between rounded border bg-muted/30 px-2 py-1">
                  <span className="font-medium">{ABILITY_LABELS[a]}</span>
                  <span>
                    {draft.abilities[a]} ({formatModifier(abilityModifier(draft.abilities[a]))})
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skill proficiencies</CardTitle>
            <CardDescription>{draft.skillProficiencies.length} total</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {draft.skillProficiencies.length === 0 ? (
              <span className="text-muted-foreground">None</span>
            ) : (
              <ul className="grid grid-cols-2 gap-x-4">
                {draft.skillProficiencies.map((s) => (
                  <li key={s}>{SKILL_BY_NAME[s]?.label ?? s}</li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory</CardTitle>
            <CardDescription>
              {draft.inventory.length} item{draft.inventory.length === 1 ? "" : "s"}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {draft.inventory.length === 0 ? (
              <span className="text-muted-foreground">No equipment selected.</span>
            ) : (
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
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Spells</CardTitle>
            <CardDescription>{draft.spells.length} known</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {draft.spells.length === 0 ? (
              <span className="text-muted-foreground">None</span>
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
    </WizardShell>
  );
}
