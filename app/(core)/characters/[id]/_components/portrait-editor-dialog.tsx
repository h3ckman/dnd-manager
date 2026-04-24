"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { updateCharacterPortrait } from "@/lib/actions/characters";
import { PortraitPicker } from "@/app/(core)/characters/_components/portrait-picker";
import type { PresetPortrait } from "@/lib/characters/portraits";

export function PortraitEditorDialog({
  characterId,
  currentPortraitUrl,
  presets,
}: {
  characterId: string;
  currentPortraitUrl: string | null;
  presets: PresetPortrait[];
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(currentPortraitUrl);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await updateCharacterPortrait(characterId, value);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Portrait updated");
        setOpen(false);
      }
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setValue(currentPortraitUrl);
      }}
    >
      <DialogTrigger
        render={
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-1 right-1 size-7 rounded-full p-0 shadow"
            title="Change portrait"
          />
        }
      >
        <PencilIcon className="size-3.5" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change portrait</DialogTitle>
        </DialogHeader>
        <PortraitPicker
          value={value}
          onChange={setValue}
          presets={presets}
        />
        <DialogFooter>
          <Button onClick={save} disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
