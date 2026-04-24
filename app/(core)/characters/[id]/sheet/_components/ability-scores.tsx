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
          <Card
            key={ability}
            className="bg-gradient-to-b from-muted/60 to-card ring-foreground/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_1px_2px_rgba(0,0,0,0.08)] dark:from-muted/30 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_1px_2px_rgba(0,0,0,0.4)]"
          >
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
                className="w-16 rounded-md border border-foreground/10 bg-background/80 px-2 py-1 text-center text-sm tabular-nums shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
              />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
