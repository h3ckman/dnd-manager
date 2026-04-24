"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { updateCampaign } from "@/lib/actions/campaigns";

export function EditablePremise({
  campaignId,
  name,
  setting,
  premise,
  canEdit,
}: {
  campaignId: string;
  name: string;
  setting: string | null;
  premise: string | null;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(premise ?? "");
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await updateCampaign(campaignId, {
        name,
        setting: setting ?? undefined,
        premise: draft || undefined,
      });
      if (res.error) toast.error(res.error);
      else {
        toast.success("Premise updated");
        setEditing(false);
      }
    });
  }

  function cancel() {
    setDraft(premise ?? "");
    setEditing(false);
  }

  if (editing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Premise</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            rows={8}
            placeholder="What's the hook? What are the PCs doing?"
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            autoFocus
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={save} disabled={pending}>
              {pending ? "Saving…" : "Save"}
            </Button>
            <Button size="sm" variant="ghost" onClick={cancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!premise) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Premise</CardTitle>
          <CardDescription>
            {canEdit
              ? "No premise yet. Share what the campaign is about."
              : "No premise yet. The DM hasn't added one."}
          </CardDescription>
          {canEdit && (
            <CardAction>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditing(true)}
                title="Add premise"
              >
                <PencilIcon className="size-4" />
              </Button>
            </CardAction>
          )}
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Premise</CardTitle>
        {canEdit && (
          <CardAction>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditing(true)}
              title="Edit premise"
            >
              <PencilIcon className="size-4" />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-sm">{premise}</p>
      </CardContent>
    </Card>
  );
}
