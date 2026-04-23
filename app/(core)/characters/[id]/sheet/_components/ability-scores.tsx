"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  ABILITY_LABELS,
  ABILITY_NAMES,
  abilityModifier,
  formatModifier,
} from "@/lib/dnd";
import { updateAbilityScore } from "@/lib/actions/sheet";
import { Card, CardContent } from "@/components/ui/card";
import type { AbilityName } from "@/lib/generated/prisma/client";

export function AbilityScores({
  characterId,
  scores,
}: {
  characterId: string;
  scores: Record<AbilityName, number>;
}) {
  const [pending, startTransition] = useTransition();

  function onBlur(ability: AbilityName, raw: string) {
    const n = parseInt(raw, 10);
    if (isNaN(n) || n === scores[ability]) return;
    startTransition(async () => {
      const res = await updateAbilityScore(characterId, { ability, score: n });
      if (res.error) toast.error(res.error);
    });
  }

  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
      {ABILITY_NAMES.map((ability) => {
        const score = scores[ability] ?? 10;
        const mod = abilityModifier(score);
        return (
          <Card key={ability}>
            <CardContent className="flex flex-col items-center gap-2 py-4">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {ABILITY_LABELS[ability]}
              </div>
              <div className="text-3xl font-bold tabular-nums">
                {formatModifier(mod)}
              </div>
              <input
                type="number"
                defaultValue={score}
                min={1}
                max={30}
                disabled={pending}
                onBlur={(e) => onBlur(ability, e.target.value)}
                className="w-16 rounded-md border bg-background px-2 py-1 text-center text-sm tabular-nums"
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
