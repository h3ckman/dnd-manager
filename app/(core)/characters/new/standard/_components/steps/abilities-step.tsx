"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  ABILITY_LABELS,
  ABILITY_NAMES,
  POINT_BUY_BUDGET,
  POINT_BUY_MAX,
  POINT_BUY_MIN,
  STANDARD_ARRAY,
  abilityModifier,
  assignScoresForClass,
  defaultAbilities,
  formatModifier,
  getClass,
  pointBuyStartingScores,
  rollStandard4d6DropLowest,
  totalPointBuyCost,
} from "@/lib/dnd";
import type { AbilityName } from "@/lib/generated/prisma/client";
import { cn } from "@/lib/utils";
import { useDraft } from "../wizard-context";
import { WizardShell } from "../wizard-shell";

type Method = "standard" | "pointBuy" | "rolled";

const METHODS: { value: Method; label: string; description: string }[] = [
  { value: "standard", label: "Standard array", description: "15, 14, 13, 12, 10, 8" },
  { value: "pointBuy", label: "Point buy", description: `Spend ${POINT_BUY_BUDGET} points (8–15)` },
  { value: "rolled", label: "4d6 drop lowest", description: "Random — six rolls" },
];

export function AbilitiesStep() {
  const { draft, setAbilities } = useDraft();
  const [method, setMethod] = useState<Method>("standard");
  const classDef = getClass(draft.identity.characterClass);

  function applyArray(arr: readonly number[]) {
    if (!classDef) {
      setAbilities(defaultAbilities());
      return;
    }
    setAbilities(assignScoresForClass(arr, classDef));
  }

  function autoAssign() {
    applyArray(STANDARD_ARRAY);
  }

  function startPointBuy() {
    setAbilities(pointBuyStartingScores());
  }

  function rollFresh() {
    applyArray(rollStandard4d6DropLowest());
  }

  function handleMethodChange(m: Method) {
    setMethod(m);
    if (m === "standard") applyArray(STANDARD_ARRAY);
    else if (m === "pointBuy") startPointBuy();
    else rollFresh();
  }

  function setOne(ability: AbilityName, value: number) {
    setAbilities({ ...draft.abilities, [ability]: value });
  }

  const pbCost = totalPointBuyCost(draft.abilities);
  const pbOver = method === "pointBuy" && pbCost > POINT_BUY_BUDGET;

  return (
    <WizardShell step="abilities" nextDisabled={pbOver}>
      <div className="flex flex-col gap-6">
        <div>
          <Label className="text-sm">Generation method</Label>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {METHODS.map((m) => {
              const selected = method === m.value;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => handleMethodChange(m.value)}
                  className={cn(
                    "rounded-md border p-3 text-left transition-colors",
                    selected
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted/50",
                  )}
                >
                  <div className="text-sm font-medium">{m.label}</div>
                  <div className="text-xs text-muted-foreground">{m.description}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {classDef && (
            <Button type="button" variant="outline" onClick={autoAssign}>
              Auto-assign for {classDef.name}
            </Button>
          )}
          {method === "rolled" && (
            <Button type="button" variant="outline" onClick={rollFresh}>
              Roll again
            </Button>
          )}
          {method === "pointBuy" && (
            <span className={cn("text-sm", pbOver ? "text-destructive" : "text-muted-foreground")}>
              Spent {pbCost} / {POINT_BUY_BUDGET} points
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {ABILITY_NAMES.map((a) => {
            const value = draft.abilities[a];
            const mod = abilityModifier(value);
            return (
              <div key={a} className="flex flex-col gap-1 rounded-md border p-3">
                <Label htmlFor={`ab-${a}`} className="text-xs uppercase">
                  {ABILITY_LABELS[a]}
                </Label>
                <input
                  id={`ab-${a}`}
                  type="number"
                  min={method === "pointBuy" ? POINT_BUY_MIN : 1}
                  max={method === "pointBuy" ? POINT_BUY_MAX : 30}
                  value={value}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!Number.isNaN(v)) setOne(a, v);
                  }}
                  className="rounded-md border bg-background px-2 py-1 text-center text-lg font-bold"
                />
                <div className="text-center text-xs text-muted-foreground">
                  {formatModifier(mod)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </WizardShell>
  );
}
