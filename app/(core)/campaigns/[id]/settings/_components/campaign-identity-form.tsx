"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateCampaign } from "@/lib/actions/campaigns";

export function CampaignIdentityForm({
  campaignId,
  initial,
}: {
  campaignId: string;
  initial: { name: string; setting: string | null; premise: string | null };
}) {
  const [name, setName] = useState(initial.name);
  const [setting, setSetting] = useState(initial.setting ?? "");
  const [premise, setPremise] = useState(initial.premise ?? "");
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await updateCampaign(campaignId, {
        name,
        setting: setting || undefined,
        premise: premise || undefined,
      });
      if (res.error) toast.error(res.error);
      else toast.success("Saved");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign details</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-name">Name</Label>
          <Input
            id="edit-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-setting">Setting</Label>
          <Input
            id="edit-setting"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-premise">Premise</Label>
          <textarea
            id="edit-premise"
            value={premise}
            onChange={(e) => setPremise(e.target.value)}
            rows={5}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          />
        </div>
        <div>
          <Button onClick={save} disabled={pending}>
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
