"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { levelForXp, xpToNextLevel } from "@/lib/dnd";
import { updateExperience } from "@/lib/actions/sheet";

export function XpTracker({
  characterId,
  experience,
  level,
}: {
  characterId: string;
  experience: number;
  level: number;
}) {
  const [xp, setXp] = useState(String(experience));
  const [pending, startTransition] = useTransition();

  function save() {
    const n = parseInt(xp, 10);
    if (isNaN(n)) return;
    startTransition(async () => {
      const res = await updateExperience(characterId, n);
      if (res.error) toast.error(res.error);
      else toast.success("XP updated");
    });
  }

  const suggested = levelForXp(experience);
  const nextXp = xpToNextLevel(level);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Experience</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-end gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-xs text-muted-foreground">XP</label>
            <Input
              type="number"
              value={xp}
              onChange={(e) => setXp(e.target.value)}
              min={0}
            />
          </div>
          <Button size="sm" onClick={save} disabled={pending}>
            Save
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Current level {level}
          {nextXp !== null ? (
            <> · {(nextXp - experience).toLocaleString()} XP to level {level + 1}</>
          ) : (
            <> · Max level</>
          )}
          {suggested !== level && (
            <span className="ml-2 rounded-md bg-amber-500/10 px-2 py-0.5 text-amber-700">
              You should be level {suggested}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
