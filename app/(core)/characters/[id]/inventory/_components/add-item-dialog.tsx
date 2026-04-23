"use client";

import { useState, useTransition } from "react";
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

const TYPES = [
  "WEAPON",
  "ARMOR",
  "SHIELD",
  "TOOL",
  "CONSUMABLE",
  "TREASURE",
  "MISC",
] as const;

const RARITIES = [
  "COMMON",
  "UNCOMMON",
  "RARE",
  "VERY_RARE",
  "LEGENDARY",
  "ARTIFACT",
] as const;

export function AddItemDialog({ characterId }: { characterId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [weight, setWeight] = useState("0");
  const [type, setType] = useState<(typeof TYPES)[number]>("MISC");
  const [rarity, setRarity] = useState<(typeof RARITIES)[number]>("COMMON");
  const [description, setDescription] = useState("");
  const [pending, startTransition] = useTransition();

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
        setName("");
        setQuantity("1");
        setWeight("0");
        setDescription("");
        setType("MISC");
        setRarity("COMMON");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
                onChange={(e) => setType(e.target.value as (typeof TYPES)[number])}
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
                onChange={(e) =>
                  setRarity(e.target.value as (typeof RARITIES)[number])
                }
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
