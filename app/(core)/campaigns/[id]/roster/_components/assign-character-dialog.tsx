"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { assignMembershipCharacter } from "@/lib/actions/campaigns";

export function AssignCharacterDialog({
  campaignId,
  currentCharacterId,
  characters,
}: {
  campaignId: string;
  currentCharacterId: string | null;
  characters: { id: string; name: string; race: string; characterClass: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(currentCharacterId ?? "");
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const res = await assignMembershipCharacter(
        campaignId,
        value === "" ? null : value,
      );
      if (res.error) toast.error(res.error);
      else {
        toast.success("Updated");
        setOpen(false);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        {currentCharacterId ? "Change character" : "Pick character"}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pick your character</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="char-pick">Character</Label>
            <select
              id="char-pick"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              <option value="">Not assigned</option>
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.race} {c.characterClass}
                </option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted-foreground">
            Handouts sent to you will appear in this character&apos;s Notes.
          </p>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={pending}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
