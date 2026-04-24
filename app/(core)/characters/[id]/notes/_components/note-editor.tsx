"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { PinIcon, Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { deleteNote, updateNote } from "@/lib/actions/notes";
import { renderMarkdown } from "@/lib/markdown";
import type {
  Note,
  NoteCategory,
} from "@/lib/generated/prisma/client";

const CATEGORIES: NoteCategory[] = [
  "CAMPAIGN",
  "SESSION",
  "NPC",
  "LORE",
  "QUEST",
  "OTHER",
];

export function NoteEditor({
  characterId,
  note,
}: {
  characterId: string;
  note: Note;
}) {
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [category, setCategory] = useState<NoteCategory>(note.category);
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await updateNote(characterId, note.id, {
        title,
        body,
        category,
      });
      if (res.error) toast.error(res.error);
      else {
        toast.success("Saved");
        setEditing(false);
      }
    });
  }

  function togglePin() {
    startTransition(async () => {
      const res = await updateNote(characterId, note.id, {
        pinned: !note.pinned,
      });
      if (res.error) toast.error(res.error);
    });
  }

  function remove() {
    if (!confirm(`Delete "${note.title}"?`)) return;
    startTransition(async () => {
      const res = await deleteNote(characterId, note.id);
      if (res.error) toast.error(res.error);
    });
  }

  const rendered = renderMarkdown(body);

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {editing ? (
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          ) : (
            note.title
          )}
        </CardTitle>
        <CardAction>
          <div className="flex items-center gap-2">
            {editing ? (
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as NoteCategory)}
                className="rounded-md border bg-background px-2 py-1 text-xs"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            ) : (
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                {note.category}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={togglePin}
              title={note.pinned ? "Unpin" : "Pin"}
            >
              <PinIcon
                className={`size-4 ${note.pinned ? "text-amber-500" : ""}`}
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={remove}
            >
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {editing ? (
          <>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={10}
              className="w-full rounded-md border bg-background px-3 py-2 font-mono text-sm"
              placeholder="# Heading&#10;- bullet&#10;**bold** *italic* `code`"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={save} disabled={pending}>
                Save
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setTitle(note.title);
                  setBody(note.body);
                  setCategory(note.category);
                  setEditing(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <>
            {body ? (
              <div
                className="prose-sm max-w-none text-sm [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-2"
                dangerouslySetInnerHTML={{ __html: rendered }}
              />
            ) : (
              <p className="text-sm italic text-muted-foreground">No body</p>
            )}
            <div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
