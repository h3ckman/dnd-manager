"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  deleteSpell,
  toggleSpellPrepared,
} from "@/lib/actions/spells";
import type { Spell } from "@/lib/generated/prisma/client";

export function SpellList({
  characterId,
  spells,
}: {
  characterId: string;
  spells: Spell[];
}) {
  const [pending, startTransition] = useTransition();

  const byLevel = new Map<number, Spell[]>();
  for (const s of spells) {
    const arr = byLevel.get(s.level) ?? [];
    arr.push(s);
    byLevel.set(s.level, arr);
  }
  const levels = [...byLevel.keys()].sort((a, b) => a - b);

  function togglePrep(id: string, prepared: boolean) {
    startTransition(async () => {
      const res = await toggleSpellPrepared(characterId, id, prepared);
      if (res.error) toast.error(res.error);
    });
  }

  function remove(id: string, name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    startTransition(async () => {
      const res = await deleteSpell(characterId, id);
      if (res.error) toast.error(res.error);
    });
  }

  if (spells.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No spells learned.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {levels.map((level) => {
        const group = byLevel.get(level) ?? [];
        group.sort((a, b) => a.name.localeCompare(b.name));
        return (
          <div key={level} className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              {level === 0 ? "Cantrips" : `Level ${level}`}
            </h3>
            {group.map((s) => (
              <Card key={s.id}>
                <CardContent className="flex items-start gap-3 py-3">
                  {level > 0 && (
                    <label className="flex flex-col items-center pt-1 text-[10px] text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={s.prepared || s.alwaysPrepared}
                        disabled={pending || s.alwaysPrepared}
                        onChange={(e) => togglePrep(s.id, e.target.checked)}
                      />
                      PREP
                    </label>
                  )}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-medium">{s.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {s.school.charAt(0) + s.school.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      {s.castingTime} · {s.range} · {s.components} · {s.duration}
                    </div>
                    {s.description && (
                      <p className="mt-2 whitespace-pre-wrap text-sm">
                        {s.description}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={pending}
                    onClick={() => remove(s.id, s.name)}
                  >
                    <Trash2Icon className="size-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        );
      })}
    </div>
  );
}
