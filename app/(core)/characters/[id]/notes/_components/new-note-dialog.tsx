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
import { createNote } from "@/lib/actions/notes";
import type { NoteCategory } from "@/lib/generated/prisma/client";

const CATEGORIES: NoteCategory[] = [
  "CAMPAIGN",
  "SESSION",
  "NPC",
  "LORE",
  "QUEST",
  "OTHER",
];

export function NewNoteDialog({ characterId }: { characterId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState<NoteCategory>("CAMPAIGN");
  const [pending, startTransition] = useTransition();

  function submit() {
    if (!title.trim()) {
      toast.error("Title required");
      return;
    }
    startTransition(async () => {
      const res = await createNote(characterId, {
        title: title.trim(),
        body,
        category,
        pinned: false,
      });
      if (res.error) toast.error(res.error);
      else {
        toast.success("Note created");
        setOpen(false);
        setTitle("");
        setBody("");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" />}>
        <PlusIcon className="size-4" />
        New note
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New note</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="note-title">Title</Label>
            <Input
              id="note-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="note-cat">Category</Label>
            <select
              id="note-cat"
              value={category}
              onChange={(e) => setCategory(e.target.value as NoteCategory)}
              className="rounded-md border bg-background px-3 py-2 text-sm"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="note-body">Body (markdown)</Label>
            <textarea
              id="note-body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={8}
              className="rounded-md border bg-background px-3 py-2 font-mono text-sm"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={submit} disabled={pending}>
            {pending ? "Saving…" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
