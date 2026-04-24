"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { SendIcon } from "lucide-react";
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
import { sendHandout } from "@/lib/actions/handouts";

type Player = { userId: string; name: string };

export function ComposeHandoutDialog({
  campaignId,
  players,
}: {
  campaignId: string;
  players: Player[];
}) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [mode, setMode] = useState<"all" | "targeted">("all");
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [pending, startTransition] = useTransition();

  function togglePlayer(userId: string) {
    const next = new Set(picked);
    if (next.has(userId)) next.delete(userId);
    else next.add(userId);
    setPicked(next);
  }

  function submit() {
    if (!title.trim()) {
      toast.error("Title required");
      return;
    }
    const recipients =
      mode === "all" ? ("all" as const) : [...picked];
    if (mode === "targeted" && recipients.length === 0) {
      toast.error("Pick at least one recipient");
      return;
    }
    startTransition(async () => {
      const res = await sendHandout(campaignId, {
        title: title.trim(),
        body,
        recipients,
      });
      if (res.error) toast.error(res.error);
      else {
        toast.success("Handout sent");
        setOpen(false);
        setTitle("");
        setBody("");
        setPicked(new Set());
        setMode("all");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <SendIcon className="size-4" />
        Send handout
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Send handout</DialogTitle>
          <DialogDescription>
            The handout will appear in recipient&apos;s Notes for whichever
            character they&apos;re playing here.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="h-title">Title</Label>
            <Input
              id="h-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="h-body">Body (markdown)</Label>
            <textarea
              id="h-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="rounded-md border bg-background px-3 py-2 font-mono text-sm"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Recipients</Label>
            <div className="flex gap-2">
              <button
                onClick={() => setMode("all")}
                className={`rounded-md border px-3 py-1 text-xs ${
                  mode === "all"
                    ? "border-primary bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                All players
              </button>
              <button
                onClick={() => setMode("targeted")}
                className={`rounded-md border px-3 py-1 text-xs ${
                  mode === "targeted"
                    ? "border-primary bg-primary/10 text-primary"
                    : "text-muted-foreground"
                }`}
              >
                Specific players
              </button>
            </div>
            {mode === "targeted" && (
              <div className="flex flex-col gap-1 rounded-md border p-2">
                {players.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No players to send to yet.
                  </p>
                ) : (
                  players.map((p) => (
                    <label
                      key={p.userId}
                      className="flex items-center gap-2 text-sm"
                    >
                      <input
                        type="checkbox"
                        checked={picked.has(p.userId)}
                        onChange={() => togglePlayer(p.userId)}
                      />
                      {p.name}
                    </label>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Sending…" : "Send"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
