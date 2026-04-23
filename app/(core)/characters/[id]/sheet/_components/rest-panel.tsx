"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  abilityModifier,
  formatModifier,
  rollDice,
} from "@/lib/dnd";
import { levelUp, longRest, shortRest } from "@/lib/actions/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BedIcon, MoonIcon, SunIcon } from "lucide-react";

export function RestPanel({
  characterId,
  hitDieType,
  hitDiceTotal,
  hitDiceUsed,
  conScore,
  level,
}: {
  characterId: string;
  hitDieType: number;
  hitDiceTotal: number;
  hitDiceUsed: number;
  conScore: number;
  level: number;
}) {
  const [diceToSpend, setDiceToSpend] = useState("1");
  const [hpGain, setHpGain] = useState(
    String(Math.max(1, Math.floor(hitDieType / 2) + 1 + abilityModifier(conScore))),
  );
  const [pending, startTransition] = useTransition();

  const conMod = abilityModifier(conScore);
  const available = hitDiceTotal - hitDiceUsed;

  function onShortRest() {
    const n = Math.max(0, Math.min(available, parseInt(diceToSpend, 10) || 0));
    let total = 0;
    for (let i = 0; i < n; i++) {
      const r = rollDice(`1d${hitDieType}`);
      if ("error" in r) continue;
      total += r.total + conMod;
    }
    startTransition(async () => {
      const res = await shortRest(characterId, n, total);
      if (res.error) toast.error(res.error);
      else toast.success(`Short rest: spent ${n}, healed ${total}`);
    });
  }

  function onLongRest() {
    if (!confirm("Take a long rest? Restores HP, half hit dice, all spell slots.")) return;
    startTransition(async () => {
      const res = await longRest(characterId);
      if (res.error) toast.error(res.error);
      else toast.success("Long rest complete");
    });
  }

  function onLevelUp() {
    const n = parseInt(hpGain, 10);
    if (isNaN(n) || n < 1) {
      toast.error("HP gain must be at least 1");
      return;
    }
    startTransition(async () => {
      const res = await levelUp(characterId, { hpGain: n });
      if (res.data) toast.success(`Leveled up to ${res.data.level}`);
      else toast.error(res.error);
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rest & Level Up</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 font-medium">
              <SunIcon className="size-4" /> Short rest
            </span>
            <span className="text-xs text-muted-foreground">
              d{hitDieType} + {formatModifier(conMod)} CON
            </span>
          </div>
          <div className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-xs text-muted-foreground">
                Hit dice to spend ({available} / {hitDiceTotal} available)
              </label>
              <Input
                type="number"
                value={diceToSpend}
                onChange={(e) => setDiceToSpend(e.target.value)}
                min={0}
                max={available}
              />
            </div>
            <Button
              variant="outline"
              onClick={onShortRest}
              disabled={pending || available === 0}
            >
              <BedIcon className="size-4" /> Rest
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-md border p-3">
          <div className="flex items-center gap-2">
            <MoonIcon className="size-4" />
            <span className="text-sm font-medium">Long rest</span>
          </div>
          <Button variant="outline" onClick={onLongRest} disabled={pending}>
            Take long rest
          </Button>
        </div>

        {level < 20 && (
          <div className="flex flex-col gap-2 rounded-md border p-3">
            <div className="text-sm font-medium">Level up to {level + 1}</div>
            <div className="flex items-end gap-2">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-xs text-muted-foreground">HP gain</label>
                <Input
                  type="number"
                  value={hpGain}
                  onChange={(e) => setHpGain(e.target.value)}
                  min={1}
                />
              </div>
              <Button onClick={onLevelUp} disabled={pending}>
                Level up
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
