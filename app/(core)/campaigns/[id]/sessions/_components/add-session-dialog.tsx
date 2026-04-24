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
import { createSessionLog } from "@/lib/actions/sessions";

export function AddSessionDialog({ campaignId }: { campaignId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!title.trim()) {
      toast.error("Title required");
      return;
    }
    startTransition(async () => {
      const res = await createSessionLog(campaignId, {
        title: title.trim(),
        body,
        sessionDate: sessionDate || undefined,
      });
      if (res.error) toast.error(res.error);
      else {
        toast.success("Session entry added");
        setOpen(false);
        setTitle("");
        setBody("");
        setSessionDate("");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <PlusIcon className="size-4" />
        Add entry
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New session entry</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="s-title">Title</Label>
            <Input
              id="s-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Session 4: The Caverns Below"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="s-date">Session date</Label>
            <Input
              id="s-date"
              type="date"
              value={sessionDate}
              onChange={(e) => setSessionDate(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="s-body">Recap (markdown)</Label>
            <textarea
              id="s-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="rounded-md border bg-background px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
