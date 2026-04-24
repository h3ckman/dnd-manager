import { SparklesIcon } from "lucide-react";
import {
  abilityModifier,
  formatModifier,
  proficiencyBonus,
} from "@/lib/dnd";
import type {
  AbilityName,
  SkillName,
} from "@/lib/generated/prisma/client";

type Character = {
  id: string;
  level: number;
  armorClass: number;
  maxHp: number;
  currentHp: number;
  tempHp: number;
  speed: number;
  inspiration: boolean;
  abilities: { ability: AbilityName; score: number }[];
  skills: { skill: SkillName; proficient: boolean; expertise: boolean }[];
  conditions: { id: string; name: string; level: number }[];
};

export function CharacterStatus({ character }: { character: Character }) {
  const dex =
    character.abilities.find((a) => a.ability === "DEX")?.score ?? 10;
  const wis =
    character.abilities.find((a) => a.ability === "WIS")?.score ?? 10;
  const perception = character.skills.find((s) => s.skill === "PERCEPTION");
  const profBonus = proficiencyBonus(character.level);

  const initMod = abilityModifier(dex);
  const wisMod = abilityModifier(wis);
  const passivePerception =
    10 +
    wisMod +
    (perception?.expertise
      ? profBonus * 2
      : perception?.proficient
        ? profBonus
        : 0);

  const hpRatio =
    character.maxHp > 0 ? character.currentHp / character.maxHp : 0;
  const barColor =
    hpRatio > 0.5
      ? "bg-emerald-500"
      : hpRatio > 0.25
        ? "bg-amber-500"
        : "bg-red-500";

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div>
        <div className="flex items-baseline justify-between text-xs">
          <span className="text-muted-foreground">HP</span>
          <span className="font-mono tabular-nums">
            {character.currentHp} / {character.maxHp}
            {character.tempHp > 0 && (
              <span className="ml-1 text-blue-600">
                +{character.tempHp}
              </span>
            )}
          </span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full ${barColor}`}
            style={{
              width: `${Math.max(0, Math.min(100, hpRatio * 100))}%`,
            }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-xs">
        <Stat label="AC" value={String(character.armorClass)} />
        <Stat label="Init" value={formatModifier(initMod)} />
        <Stat label="Spd" value={`${character.speed}ft`} />
        <Stat label="PP" value={String(passivePerception)} />
        {character.inspiration && (
          <span className="flex items-center gap-1 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-amber-700">
            <SparklesIcon className="size-3" /> Inspired
          </span>
        )}
      </div>

      {character.conditions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {character.conditions.map((c) => (
            <span
              key={c.id}
              className="rounded-md border border-red-400/40 bg-red-500/10 px-2 py-0.5 text-xs text-red-700"
            >
              {c.name}
              {c.level > 1 && ` ${c.level}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-baseline gap-1 rounded-md border px-2 py-0.5">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-mono tabular-nums">{value}</span>
    </span>
  );
}
