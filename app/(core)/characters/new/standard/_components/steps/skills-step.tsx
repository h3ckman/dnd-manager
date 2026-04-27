"use client";

import { useMemo } from "react";
import { Label } from "@/components/ui/label";
import {
  BACKGROUND_GRANTS,
  CLASS_SKILL_CHOICES,
  SKILL_BY_NAME,
} from "@/lib/dnd";
import type { SkillName } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import { useDraft } from "../wizard-context";
import { WizardShell } from "../wizard-shell";

export function SkillsStep() {
  const { draft, setSkills } = useDraft();
  const classDef = CLASS_SKILL_CHOICES[draft.identity.characterClass];
  const bgGrant = BACKGROUND_GRANTS[draft.identity.background];
  const lockedSkills = useMemo(() => new Set<SkillName>(bgGrant?.skills ?? []), [bgGrant]);

  const selected = new Set<SkillName>(draft.skillProficiencies);
  // Background skills are always selected.
  for (const s of lockedSkills) selected.add(s);

  const choosable = (classDef?.from ?? []).filter((s) => !lockedSkills.has(s));
  const classChosenCount = (classDef?.from ?? []).reduce(
    (n, s) => n + (selected.has(s) && !lockedSkills.has(s) ? 1 : 0),
    0,
  );
  const classMax = classDef?.count ?? 0;
  const remaining = classMax - classChosenCount;

  function toggle(skill: SkillName) {
    if (lockedSkills.has(skill)) return;
    const next = new Set(selected);
    if (next.has(skill)) {
      next.delete(skill);
    } else {
      if (classDef && choosable.includes(skill) && classChosenCount >= classMax) return;
      next.add(skill);
    }
    setSkills(Array.from(next));
  }

  const nextDisabled = classDef ? remaining > 0 : false;

  return (
    <WizardShell step="skills" nextDisabled={nextDisabled}>
      <div className="flex flex-col gap-6">
        <div>
          <Label>Background skills</Label>
          <p className="text-xs text-muted-foreground">
            Granted automatically by your background.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {Array.from(lockedSkills).length === 0 ? (
              <span className="text-sm text-muted-foreground">None</span>
            ) : (
              Array.from(lockedSkills).map((s) => (
                <span
                  key={s}
                  className="rounded-full border bg-muted px-3 py-1 text-sm"
                >
                  {SKILL_BY_NAME[s]?.label ?? s}
                </span>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label>Class skills</Label>
            {classDef && (
              <span className={cn(
                "text-xs",
                remaining > 0 ? "text-destructive" : "text-muted-foreground",
              )}>
                Pick {classMax} ({remaining > 0 ? `${remaining} left` : "done"})
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Choose from your class&apos;s skill list. Background skills above
            don&apos;t count toward your class picks.
          </p>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {choosable.length === 0 && classDef === undefined && (
              <span className="text-sm text-muted-foreground">No class skill data.</span>
            )}
            {choosable.map((skill) => {
              const isSelected = selected.has(skill);
              const atCap = !isSelected && classChosenCount >= classMax;
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggle(skill)}
                  disabled={atCap}
                  className={cn(
                    "flex items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition-colors",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50",
                    atCap && "opacity-50",
                  )}
                >
                  <span>{SKILL_BY_NAME[skill]?.label ?? skill}</span>
                  {isSelected && <span className="text-xs text-primary">Selected</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </WizardShell>
  );
}
