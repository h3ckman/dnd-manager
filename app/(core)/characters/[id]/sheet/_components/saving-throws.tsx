"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  ABILITY_LABELS,
  ABILITY_NAMES,
  abilityModifier,
  formatModifier,
} from "@/lib/dnd";
import { toggleSavingThrow } from "@/lib/actions/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AbilityName } from "@/lib/generated/prisma/client";

export function SavingThrows({
  characterId,
  scores,
  proficiencies,
  proficiencyBonus,
}: {
  characterId: string;
  scores: Record<AbilityName, number>;
  proficiencies: Record<AbilityName, boolean>;
  proficiencyBonus: number;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saving Throws</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {ABILITY_NAMES.map((ability) => {
          const score = scores[ability] ?? 10;
          const prof = proficiencies[ability] ?? false;
          const mod = abilityModifier(score) + (prof ? proficiencyBonus : 0);
          return (
            <label
              key={ability}
              className="flex items-center gap-3 rounded-md px-2 py-1 hover:bg-muted"
            >
              <input
                type="checkbox"
                checked={prof}
                disabled={pending}
                onChange={(e) => {
                  startTransition(async () => {
                    const res = await toggleSavingThrow(
                      characterId,
                      ability,
                      e.target.checked,
                    );
                    if (res.error) toast.error(res.error);
                  });
                }}
              />
              <span className="flex-1 text-sm">{ABILITY_LABELS[ability]}</span>
              <span className="font-mono text-sm tabular-nums">
                {formatModifier(mod)}
              </span>
            </label>
          );
        })}
      </CardContent>
    </Card>
  );
}
