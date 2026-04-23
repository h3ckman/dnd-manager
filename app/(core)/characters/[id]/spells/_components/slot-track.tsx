"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { adjustSlot, updateSlotMaxes } from "@/lib/actions/spells";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function SlotTrack({
  characterId,
  slots,
}: {
  characterId: string;
  slots: { max: number; used: number }[];
}) {
  const [pending, startTransition] = useTransition();
  const [editing, setEditing] = useState(false);
  const [maxes, setMaxes] = useState(slots.map((s) => s.max));

  function toggle(level: number, used: boolean) {
    startTransition(async () => {
      const res = await adjustSlot(characterId, level, used ? 1 : -1);
      if (res.error) toast.error(res.error);
    });
  }

  function saveMaxes() {
    startTransition(async () => {
      const res = await updateSlotMaxes(characterId, {
        slot1Max: maxes[0],
        slot2Max: maxes[1],
        slot3Max: maxes[2],
        slot4Max: maxes[3],
        slot5Max: maxes[4],
        slot6Max: maxes[5],
        slot7Max: maxes[6],
        slot8Max: maxes[7],
        slot9Max: maxes[8],
      });
      if (res.error) toast.error(res.error);
      else {
        toast.success("Slots updated");
        setEditing(false);
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Spell Slots</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setEditing(!editing)}
        >
          {editing ? "Cancel" : "Edit maxes"}
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {slots.map((s, idx) => {
          const level = idx + 1;
          const max = editing ? maxes[idx] : s.max;
          if (!editing && max === 0) return null;
          return (
            <div key={level} className="flex items-center gap-2">
              <span className="w-10 text-sm font-medium">L{level}</span>
              {editing ? (
                <input
                  type="number"
                  value={maxes[idx]}
                  onChange={(e) => {
                    const next = [...maxes];
                    next[idx] = parseInt(e.target.value, 10) || 0;
                    setMaxes(next);
                  }}
                  min={0}
                  max={99}
                  className="w-16 rounded-md border bg-background px-2 py-1 text-sm"
                />
              ) : (
                <div className="flex gap-1">
                  {Array.from({ length: max }).map((_, i) => {
                    const isUsed = i < s.used;
                    return (
                      <button
                        key={i}
                        title={isUsed ? "Expended (click to recover)" : "Available (click to use)"}
                        disabled={pending}
                        onClick={() => toggle(level, !isUsed)}
                        className={`h-5 w-5 rounded-full border-2 ${
                          isUsed
                            ? "border-muted bg-muted"
                            : "border-primary bg-primary/20"
                        }`}
                      />
                    );
                  })}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {max - s.used} / {max}
                  </span>
                </div>
              )}
            </div>
          );
        })}
        {editing && (
          <Button size="sm" onClick={saveMaxes} disabled={pending}>
            Save
          </Button>
        )}
        {!editing && slots.every((s) => s.max === 0) && (
          <p className="text-sm text-muted-foreground">
            No spell slots. Click &quot;Edit maxes&quot; to set them.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
