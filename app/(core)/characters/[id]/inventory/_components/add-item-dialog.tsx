"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addInventoryItem } from "@/lib/actions/inventory";
import { ITEM_CATALOG, type CatalogItem } from "@/lib/dnd";
import type {
  ItemRarity,
  ItemType,
} from "@/lib/generated/prisma/client";

const TYPES: ItemType[] = [
  "WEAPON",
  "ARMOR",
  "SHIELD",
  "TOOL",
  "CONSUMABLE",
  "TREASURE",
  "MISC",
];

const RARITIES: ItemRarity[] = [
  "COMMON",
  "UNCOMMON",
  "RARE",
  "VERY_RARE",
  "LEGENDARY",
  "ARTIFACT",
];

const TYPE_LABELS: Record<ItemType, string> = {
  WEAPON: "Weapons",
  ARMOR: "Armor",
  SHIELD: "Shields",
  TOOL: "Tools",
  CONSUMABLE: "Consumables",
  TREASURE: "Treasure",
  MISC: "Gear",
};

const CUSTOM = "__custom__";

export function AddItemDialog({ characterId }: { characterId: string }) {
  const [open, setOpen] = useState(false);
  const [preset, setPreset] = useState<string>(CUSTOM);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [weight, setWeight] = useState("0");
  const [type, setType] = useState<ItemType>("MISC");
  const [rarity, setRarity] = useState<ItemRarity>("COMMON");
  const [description, setDescription] = useState("");
  const [pending, startTransition] = useTransition();

  const groups = useMemo(() => {
    const byType = new Map<ItemType, CatalogItem[]>();
    for (const i of ITEM_CATALOG) {
      const arr = byType.get(i.type) ?? [];
      arr.push(i);
      byType.set(i.type, arr);
    }
    return TYPES.filter((t) => byType.has(t)).map(
      (t) => [t, byType.get(t)!] as const,
    );
  }, []);

  function applyPreset(presetName: string) {
    setPreset(presetName);
    if (presetName === CUSTOM) return;
    const found = ITEM_CATALOG.find((i) => i.name === presetName);
    if (!found) return;
    setName(found.name);
    setWeight(String(found.weight));
    setType(found.type);
    setRarity(found.rarity);
    setDescription(found.description);
  }

  function reset() {
    setPreset(CUSTOM);
    setName("");
    setQuantity("1");
    setWeight("0");
    setType("MISC");
    setRarity("COMMON");
    setDescription("");
  }

  function submit() {
    if (!name.trim()) {
      toast.error("Name required");
      return;
    }
    startTransition(async () => {
      const res = await addInventoryItem(characterId, {
        name: name.trim(),
        quantity: parseInt(quantity, 10) || 1,
        weight: parseFloat(weight) || 0,
        type,
        rarity,
        description: description.trim() || undefined,
        equipped: false,
        attuned: false,
      });
      if (res.error) toast.error(res.error);
      else {
        toast.success("Item added");
        setOpen(false);
        reset();
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon className="size-4" />
        Add item
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add item</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="item-preset">Pick from catalog</Label>
            <select
              id="item-preset"
              value={preset}
              onChange={(e) => applyPreset(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value={CUSTOM}>Custom (enter manually)</option>
              {groups.map(([t, items]) => (
                <optgroup key={t} label={TYPE_LABELS[t]}>
                  {items.map((i) => (
                    <option key={i.name} value={i.name}>
                      {i.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="item-name">Name</Label>
            <Input
              id="item-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="item-qty">Quantity</Label>
              <Input
                id="item-qty"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min={1}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="item-weight">Weight (lb)</Label>
              <Input
                id="item-weight"
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                min={0}
                step={0.1}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-2">
              <Label htmlFor="item-type">Type</Label>
              <select
                id="item-type"
                value={type}
                onChange={(e) => setType(e.target.value as ItemType)}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="item-rarity">Rarity</Label>
              <select
                id="item-rarity"
                value={rarity}
                onChange={(e) => setRarity(e.target.value as ItemRarity)}
                className="rounded-md border bg-background px-3 py-2 text-sm"
              >
                {RARITIES.map((r) => (
                  <option key={r} value={r}>
                    {r.replace("_", " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="item-desc">Description</Label>
            <textarea
              id="item-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Adding…" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
