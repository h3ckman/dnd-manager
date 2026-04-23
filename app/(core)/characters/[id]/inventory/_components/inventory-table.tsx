"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  deleteInventoryItem,
  updateInventoryItem,
} from "@/lib/actions/inventory";
import type {
  InventoryItem,
  ItemRarity,
  ItemType,
} from "@/lib/generated/prisma/client";

const RARITY_COLOR: Record<ItemRarity, string> = {
  COMMON: "text-muted-foreground",
  UNCOMMON: "text-emerald-600",
  RARE: "text-blue-600",
  VERY_RARE: "text-purple-600",
  LEGENDARY: "text-amber-600",
  ARTIFACT: "text-red-600",
};

const TYPE_LABEL: Record<ItemType, string> = {
  WEAPON: "Weapon",
  ARMOR: "Armor",
  SHIELD: "Shield",
  TOOL: "Tool",
  CONSUMABLE: "Consumable",
  TREASURE: "Treasure",
  MISC: "Misc",
};

export function InventoryTable({
  characterId,
  items,
}: {
  characterId: string;
  items: InventoryItem[];
}) {
  const [pending, startTransition] = useTransition();

  function remove(id: string, name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    startTransition(async () => {
      const res = await deleteInventoryItem(characterId, id);
      if (res.error) toast.error(res.error);
    });
  }

  function toggle(id: string, key: "equipped" | "attuned", value: boolean) {
    startTransition(async () => {
      const res = await updateInventoryItem(characterId, id, { [key]: value });
      if (res.error) toast.error(res.error);
    });
  }

  function updateQty(id: string, qty: number) {
    if (qty < 1) return;
    startTransition(async () => {
      const res = await updateInventoryItem(characterId, id, { quantity: qty });
      if (res.error) toast.error(res.error);
    });
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No items yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex items-start gap-3 py-3">
            <div className="flex flex-col items-center gap-1 pt-1">
              <label className="flex flex-col items-center text-[10px] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={item.equipped}
                  disabled={pending}
                  onChange={(e) =>
                    toggle(item.id, "equipped", e.target.checked)
                  }
                />
                EQ
              </label>
              <label className="flex flex-col items-center text-[10px] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={item.attuned}
                  disabled={pending}
                  onChange={(e) =>
                    toggle(item.id, "attuned", e.target.checked)
                  }
                />
                AT
              </label>
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="font-medium">{item.name}</span>
                <span className="text-xs text-muted-foreground">
                  {TYPE_LABEL[item.type]}
                </span>
                {item.rarity !== "COMMON" && (
                  <span className={`text-xs ${RARITY_COLOR[item.rarity]}`}>
                    {item.rarity.replace("_", " ")}
                  </span>
                )}
              </div>
              {item.description && (
                <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>×</span>
                <input
                  type="number"
                  value={item.quantity}
                  min={1}
                  onChange={(e) =>
                    updateQty(item.id, parseInt(e.target.value, 10) || 1)
                  }
                  className="w-14 rounded-md border bg-background px-2 py-1 text-sm"
                />
              </div>
              {item.weight > 0 && (
                <span className="text-xs text-muted-foreground">
                  {item.weight} lb
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={() => remove(item.id, item.name)}
              >
                <Trash2Icon className="size-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
