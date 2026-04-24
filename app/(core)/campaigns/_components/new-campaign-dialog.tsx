"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCampaign } from "@/lib/actions/campaigns";

export function NewCampaignDialog() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await createCampaign(undefined, formData);
      if (res?.error) toast.error(res.error);
      else setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon className="size-4" />
        New campaign
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New campaign</DialogTitle>
          <DialogDescription>
            You&apos;ll be the DM. Invite players with a shareable code from
            settings.
          </DialogDescription>
        </DialogHeader>
        <form action={onSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="campaign-name">Name</Label>
            <Input id="campaign-name" name="name" required />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="campaign-setting">Setting</Label>
            <Input
              id="campaign-setting"
              name="setting"
              placeholder="Forgotten Realms, Eberron, homebrew…"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="campaign-premise">Premise</Label>
            <textarea
              id="campaign-premise"
              name="premise"
              rows={4}
              placeholder="What's the hook? What are the PCs doing?"
              className="rounded-md border bg-background px-3 py-2 text-sm"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating…" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
