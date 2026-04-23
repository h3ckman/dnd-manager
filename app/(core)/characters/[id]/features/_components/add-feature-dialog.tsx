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
import { addFeature } from "@/lib/actions/features";

export function AddFeatureDialog({ characterId }: { characterId: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [source, setSource] = useState("");
  const [description, setDescription] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!name.trim() || !source.trim()) {
      toast.error("Name and source required");
      return;
    }
    startTransition(async () => {
      const res = await addFeature(characterId, {
        name: name.trim(),
        source: source.trim(),
        description,
      });
      if (res.error) toast.error(res.error);
      else {
        toast.success("Feature added");
        setOpen(false);
        setName("");
        setSource("");
        setDescription("");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon className="size-4" />
        Add feature
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add feature or trait</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="feat-name">Name</Label>
            <Input
              id="feat-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Second Wind"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="feat-source">Source</Label>
            <Input
              id="feat-source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="Fighter 1"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="feat-desc">Description</Label>
            <textarea
              id="feat-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
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
