"use client";

import { useState } from "react";
import { DicesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { rollDice, type DiceRollResult } from "@/lib/dnd";

type HistoryEntry = DiceRollResult & { at: Date; label: string };

const QUICK = ["1d4", "1d6", "1d8", "1d10", "1d12", "1d20", "1d100"];

export function DiceRoller() {
  const [expr, setExpr] = useState("1d20");
  const [mode, setMode] = useState<"normal" | "advantage" | "disadvantage">(
    "normal",
  );
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  function roll(expression: string) {
    const result = rollDice(expression, mode);
    if ("error" in result) {
      setError(result.error);
      return;
    }
    setError(null);
    setHistory((h) =>
      [{ ...result, at: new Date(), label: expression }, ...h].slice(0, 50),
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Dice Roller</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-end gap-2">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-xs text-muted-foreground">
                Expression (e.g. 2d6+3)
              </label>
              <Input
                value={expr}
                onChange={(e) => setExpr(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") roll(expr);
                }}
              />
            </div>
            <Button onClick={() => roll(expr)}>
              <DicesIcon className="size-4" />
              Roll
            </Button>
          </div>

          <div className="flex gap-2">
            {(["normal", "advantage", "disadvantage"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md border px-3 py-1 text-xs capitalize ${
                  mode === m
                    ? "border-primary bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <Button
                key={q}
                variant="outline"
                size="sm"
                onClick={() => {
                  setExpr(q);
                  roll(q);
                }}
              >
                {q}
              </Button>
            ))}
          </div>

          {error && (
            <p className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-600">
              {error}
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <CardTitle>History</CardTitle>
          {history.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHistory([])}
            >
              Clear
            </Button>
          )}
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Rolls will appear here.
            </p>
          ) : (
            history.map((h, i) => (
              <div
                key={i}
                className="flex items-baseline gap-3 rounded-md border p-2"
              >
                <div className="text-2xl font-bold tabular-nums">{h.total}</div>
                <div className="flex-1 text-sm">
                  <div className="font-mono text-xs">{h.label}</div>
                  <div className="text-xs text-muted-foreground">
                    [{h.rolls.join(", ")}]
                    {h.modifier !== 0 &&
                      ` ${h.modifier > 0 ? "+" : ""}${h.modifier}`}
                    {h.kept && ` · ${h.kept}`}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground tabular-nums">
                  {h.at.toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
