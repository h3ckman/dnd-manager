"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { XIcon } from "lucide-react";
import { CONDITIONS } from "@/lib/dnd";
import { addCondition, removeCondition } from "@/lib/actions/conditions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type ConditionRow = {
  id: string;
  name: string;
  level: number;
  note: string | null;
};

export function ConditionsPanel({
  characterId,
  conditions,
}: {
  characterId: string;
  conditions: ConditionRow[];
}) {
  const [selected, setSelected] = useState(CONDITIONS[0].name);
  const [level, setLevel] = useState(1);
  const [pending, startTransition] = useTransition();

  const selectedDef = CONDITIONS.find((c) => c.name === selected);
  const hasLevels = selectedDef?.hasLevels ?? false;

  function onAdd() {
    startTransition(async () => {
      const res = await addCondition(characterId, {
        name: selected,
        level: hasLevels ? level : 1,
      });
      if (res.error) toast.error(res.error);
      else toast.success(`Added ${selected}`);
    });
  }

  function onRemove(id: string, name: string) {
    startTransition(async () => {
      const res = await removeCondition(characterId, id);
      if (res.error) toast.error(res.error);
      else toast.success(`Removed ${name}`);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conditions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {conditions.length === 0 ? (
            <span className="text-sm text-muted-foreground">None</span>
          ) : (
            conditions.map((c) => {
              const def = CONDITIONS.find((d) => d.name === c.name);
              return (
                <button
                  key={c.id}
                  className="flex items-center gap-1 rounded-md border border-red-400/50 bg-red-500/10 px-2 py-1 text-xs text-red-700 hover:bg-red-500/20"
                  title={def?.description ?? ""}
                  disabled={pending}
                  onClick={() => onRemove(c.id, c.name)}
                >
                  {c.name}
                  {c.level > 1 && ` ${c.level}`}
                  <XIcon className="size-3" />
                </button>
              );
            })
          )}
        </div>
        <div className="flex items-end gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-xs text-muted-foreground">Add</label>
            <select
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              {CONDITIONS.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          {hasLevels && (
            <div className="flex flex-col gap-1">
              <label className="text-xs text-muted-foreground">Level</label>
              <input
                type="number"
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value, 10) || 1)}
                min={1}
                max={6}
                className="w-16 rounded-md border bg-background px-2 py-2 text-sm"
              />
            </div>
          )}
          <Button size="sm" onClick={onAdd} disabled={pending}>
            Add
          </Button>
        </div>
        {selectedDef && (
          <p className="text-xs text-muted-foreground">{selectedDef.description}</p>
        )}
      </CardContent>
    </Card>
  );
}
