"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { abilityModifier, formatModifier } from "@/lib/dnd";
import { updateCombatStats } from "@/lib/actions/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AbilityName } from "@/lib/generated/prisma/client";

export function CombatStats({
  characterId,
  armorClass,
  maxHp,
  tempHp,
  hitDieType,
  speed,
  initiativeScore,
  proficiencyBonus,
}: {
  characterId: string;
  armorClass: number;
  maxHp: number;
  tempHp: number;
  hitDieType: number;
  speed: number;
  initiativeScore: number;
  proficiencyBonus: number;
}) {
  const [ac, setAc] = useState(String(armorClass));
  const [hp, setHp] = useState(String(maxHp));
  const [hitDie, setHitDie] = useState(String(hitDieType));
  const [spd, setSpd] = useState(String(speed));
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await updateCombatStats(characterId, {
        armorClass: parseInt(ac, 10) || 10,
        maxHp: parseInt(hp, 10) || 1,
        tempHp,
        hitDieType: parseInt(hitDie, 10) || 8,
        speed: parseInt(spd, 10) || 30,
      });
      if (res.error) toast.error(res.error);
      else toast.success("Combat stats saved");
    });
  }

  const initMod = abilityModifier(initiativeScore);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Combat Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Armor Class" editable value={ac} onChange={setAc} />
          <Stat label="Max HP" editable value={hp} onChange={setHp} />
          <Stat label="Speed" editable value={spd} onChange={setSpd} suffix="ft" />
          <Stat label="Hit Die" editable value={hitDie} onChange={setHitDie} prefix="d" />
          <Stat label="Initiative" value={formatModifier(initMod)} />
          <Stat label="Prof. Bonus" value={formatModifier(proficiencyBonus)} />
        </div>
        <div>
          <Button size="sm" onClick={save} disabled={pending}>
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  onChange,
  editable,
  prefix,
  suffix,
}: {
  label: string;
  value: string;
  editable?: boolean;
  onChange?: (v: string) => void;
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border p-2">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {editable ? (
        <div className="flex items-center gap-1">
          {prefix && <span className="text-sm">{prefix}</span>}
          <input
            type="number"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="w-16 rounded-md border bg-background px-2 py-1 text-sm"
          />
          {suffix && (
            <span className="text-xs text-muted-foreground">{suffix}</span>
          )}
        </div>
      ) : (
        <span className="text-lg font-bold tabular-nums">{value}</span>
      )}
    </div>
  );
}

export type { AbilityName };
