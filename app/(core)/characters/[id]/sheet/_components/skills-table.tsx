"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  ABILITY_SHORT,
  SKILLS,
  abilityModifier,
  formatModifier,
} from "@/lib/dnd";
import { updateSkillProficiency } from "@/lib/actions/sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AbilityName, SkillName } from "@/lib/generated/prisma/client";

type SkillState = { proficient: boolean; expertise: boolean };

export function SkillsTable({
  characterId,
  scores,
  skills,
  proficiencyBonus,
}: {
  characterId: string;
  scores: Record<AbilityName, number>;
  skills: Record<SkillName, SkillState>;
  proficiencyBonus: number;
}) {
  const [pending, startTransition] = useTransition();

  function save(skill: SkillName, next: SkillState) {
    startTransition(async () => {
      const res = await updateSkillProficiency(
        characterId,
        skill,
        next.proficient,
        next.expertise,
      );
      if (res.error) toast.error(res.error);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-0.5">
        {SKILLS.map((s) => {
          const state = skills[s.name] ?? {
            proficient: false,
            expertise: false,
          };
          const abilityMod = abilityModifier(scores[s.ability] ?? 10);
          const profMult = state.expertise ? 2 : state.proficient ? 1 : 0;
          const total = abilityMod + proficiencyBonus * profMult;
          return (
            <div
              key={s.name}
              className="flex items-center gap-2 rounded-md px-2 py-1 hover:bg-muted"
            >
              <input
                type="checkbox"
                checked={state.proficient}
                disabled={pending}
                title="Proficient"
                onChange={(e) =>
                  save(s.name, {
                    proficient: e.target.checked,
                    expertise: e.target.checked && state.expertise,
                  })
                }
              />
              <input
                type="checkbox"
                checked={state.expertise}
                disabled={pending || !state.proficient}
                title="Expertise"
                onChange={(e) =>
                  save(s.name, {
                    proficient: state.proficient,
                    expertise: e.target.checked,
                  })
                }
              />
              <span className="flex-1 text-sm">{s.label}</span>
              <span className="w-8 text-right text-xs text-muted-foreground">
                {ABILITY_SHORT[s.ability]}
              </span>
              <span className="w-10 text-right font-mono text-sm tabular-nums">
                {formatModifier(total)}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
