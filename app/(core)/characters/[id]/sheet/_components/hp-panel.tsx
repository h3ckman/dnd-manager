"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { adjustHp, setTempHp, toggleInspiration } from "@/lib/actions/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SparklesIcon } from "lucide-react";

export function HpPanel({
  characterId,
  currentHp,
  maxHp,
  tempHp,
  inspiration,
}: {
  characterId: string;
  currentHp: number;
  maxHp: number;
  tempHp: number;
  inspiration: boolean;
}) {
  const [delta, setDelta] = useState("");
  const [temp, setTemp] = useState(String(tempHp));
  const [pending, startTransition] = useTransition();

  function apply(sign: 1 | -1) {
    const n = parseInt(delta, 10);
    if (isNaN(n) || n <= 0) return;
    startTransition(async () => {
      const res = await adjustHp(characterId, sign * n);
      if (res.error) toast.error(res.error);
      else setDelta("");
    });
  }

  function onTempBlur() {
    const n = parseInt(temp, 10);
    if (isNaN(n) || n === tempHp) return;
    startTransition(async () => {
      const res = await setTempHp(characterId, n);
      if (res.error) toast.error(res.error);
    });
  }

  const ratio = maxHp > 0 ? currentHp / maxHp : 0;
  const barColor =
    ratio > 0.5
      ? "bg-emerald-500"
      : ratio > 0.25
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Hit Points</CardTitle>
        <button
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              const res = await toggleInspiration(characterId);
              if (res.error) toast.error(res.error);
            })
          }
          className={`flex items-center gap-1 rounded-md border px-2 py-1 text-xs ${inspiration ? "border-amber-500 text-amber-600" : "text-muted-foreground"}`}
          title="Inspiration"
        >
          <SparklesIcon className="size-3.5" />
          {inspiration ? "Inspired" : "Inspiration"}
        </button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold tabular-nums">
              {currentHp}
              <span className="text-lg text-muted-foreground"> / {maxHp}</span>
            </div>
            {tempHp > 0 && (
              <div className="text-sm text-blue-600">+{tempHp} temp</div>
            )}
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full ${barColor}`}
              style={{ width: `${Math.max(0, Math.min(100, ratio * 100))}%` }}
            />
          </div>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-xs text-muted-foreground">Amount</label>
            <Input
              type="number"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              min={1}
            />
          </div>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => apply(-1)}
          >
            Damage
          </Button>
          <Button
            variant="outline"
            disabled={pending}
            onClick={() => apply(1)}
          >
            Heal
          </Button>
        </div>
        <div className="flex items-end gap-2">
          <div className="flex flex-1 flex-col gap-1">
            <label className="text-xs text-muted-foreground">Temp HP</label>
            <Input
              type="number"
              value={temp}
              onChange={(e) => setTemp(e.target.value)}
              onBlur={onTempBlur}
              min={0}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
