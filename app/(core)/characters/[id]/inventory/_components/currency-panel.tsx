"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { updateCurrency } from "@/lib/actions/inventory";

const COINS = [
  { key: "copper", label: "CP", color: "text-orange-700" },
  { key: "silver", label: "SP", color: "text-gray-500" },
  { key: "electrum", label: "EP", color: "text-emerald-700" },
  { key: "gold", label: "GP", color: "text-amber-500" },
  { key: "platinum", label: "PP", color: "text-sky-500" },
] as const;

export function CurrencyPanel({
  characterId,
  copper,
  silver,
  electrum,
  gold,
  platinum,
}: {
  characterId: string;
  copper: number;
  silver: number;
  electrum: number;
  gold: number;
  platinum: number;
}) {
  const [values, setValues] = useState({
    copper,
    silver,
    electrum,
    gold,
    platinum,
  });
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await updateCurrency(characterId, values);
      if (res.error) toast.error(res.error);
      else toast.success("Currency updated");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="grid grid-cols-5 gap-2">
          {COINS.map((c) => (
            <div key={c.key} className="flex flex-col gap-1">
              <label className={`text-xs font-semibold ${c.color}`}>
                {c.label}
              </label>
              <input
                type="number"
                value={values[c.key]}
                min={0}
                onChange={(e) =>
                  setValues({
                    ...values,
                    [c.key]: parseInt(e.target.value, 10) || 0,
                  })
                }
                className="rounded-md border bg-background px-2 py-1 text-sm"
              />
            </div>
          ))}
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
