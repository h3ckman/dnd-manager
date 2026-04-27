"use client";

import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  BACKGROUND_GRANTS,
  CLASS_EQUIPMENT_BUNDLES,
  type EquipmentBundle,
} from "@/lib/dnd";
import { cn } from "@/lib/utils";
import { useDraft } from "../wizard-context";
import { WizardShell } from "../wizard-shell";

export function EquipmentStep() {
  const { draft, setInventory } = useDraft();
  const bundles = CLASS_EQUIPMENT_BUNDLES[draft.identity.characterClass] ?? [];
  const bgGrant = BACKGROUND_GRANTS[draft.identity.background];

  const [bundleIdx, setBundleIdx] = useState(() => {
    const matched = bundles.findIndex((b) =>
      sameNames(b.items.map((i) => i.name), draft.inventory.map((i) => i.name)),
    );
    return matched >= 0 ? matched : 0;
  });

  const selected = bundles[bundleIdx];

  const inventory = useMemo(() => {
    const fromClass = (selected?.items ?? []).map((i) => ({ ...i }));
    const fromBg = (bgGrant?.equipment ?? []).map((i) => ({
      name: i.name,
      quantity: i.quantity ?? 1,
    }));
    return [...fromClass, ...fromBg];
  }, [selected, bgGrant]);

  useEffect(() => {
    setInventory(inventory);
  }, [inventory, setInventory]);

  return (
    <WizardShell step="equipment">
      <div className="flex flex-col gap-6">
        {bundles.length > 0 ? (
          <div>
            <Label>Class equipment bundle</Label>
            <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2">
              {bundles.map((b, i) => (
                <BundleCard
                  key={b.label}
                  bundle={b}
                  selected={i === bundleIdx}
                  onSelect={() => setBundleIdx(i)}
                />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No starting equipment defined for this class.
          </p>
        )}

        {bgGrant && bgGrant.equipment.length > 0 && (
          <div>
            <Label>From your background</Label>
            <ul className="mt-2 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
              {bgGrant.equipment.map((it) => (
                <li
                  key={it.name}
                  className="rounded border bg-muted/30 px-2 py-1"
                >
                  {it.name}
                  {(it.quantity ?? 1) > 1 && (
                    <span className="ml-1 text-muted-foreground">×{it.quantity}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <Label>Final inventory</Label>
          <ul className="mt-2 grid grid-cols-1 gap-1 text-sm sm:grid-cols-2">
            {inventory.map((it, i) => (
              <li
                key={`${it.name}-${i}`}
                className="flex justify-between rounded border bg-background px-2 py-1"
              >
                <span>{it.name}</span>
                {(it.quantity ?? 1) > 1 && (
                  <span className="text-muted-foreground">×{it.quantity}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </WizardShell>
  );
}

function BundleCard({
  bundle,
  selected,
  onSelect,
}: {
  bundle: EquipmentBundle;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col gap-2 rounded-md border p-4 text-left transition-colors",
        selected ? "border-primary bg-primary/5" : "hover:bg-muted/50",
      )}
    >
      <div className="font-medium">{bundle.label}</div>
      {bundle.description && (
        <div className="text-xs text-muted-foreground">{bundle.description}</div>
      )}
      <ul className="mt-1 flex flex-wrap gap-1 text-xs">
        {bundle.items.map((it, i) => (
          <li
            key={`${it.name}-${i}`}
            className="rounded-full border bg-background px-2 py-0.5"
          >
            {it.name}
            {(it.quantity ?? 1) > 1 && ` ×${it.quantity}`}
          </li>
        ))}
      </ul>
    </button>
  );
}

function sameNames(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  for (let i = 0; i < sa.length; i++) if (sa[i] !== sb[i]) return false;
  return true;
}
