"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { CopyIcon, RefreshCwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { regenerateInviteCode } from "@/lib/actions/campaigns";

export function InvitePanel({
  campaignId,
  initialCode,
}: {
  campaignId: string;
  initialCode: string;
}) {
  const [code, setCode] = useState(initialCode);
  const [pending, startTransition] = useTransition();
  const origin =
    typeof window !== "undefined" ? window.location.origin : "";
  const link = `${origin}/campaigns/join?code=${code}`;

  function copy() {
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Invite link copied");
    });
  }

  function regenerate() {
    if (!confirm("Regenerate? Old invite links will stop working.")) return;
    startTransition(async () => {
      const res = await regenerateInviteCode(campaignId);
      if (res.data) {
        setCode(res.data.inviteCode);
        toast.success("New invite code");
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite players</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 rounded-md border bg-muted px-3 py-2 font-mono text-sm">
            {code}
          </div>
          <Button variant="outline" onClick={copy}>
            <CopyIcon className="size-4" /> Copy link
          </Button>
          <Button
            variant="outline"
            onClick={regenerate}
            disabled={pending}
          >
            <RefreshCwIcon className="size-4" /> Regenerate
          </Button>
        </div>
        <p className="text-xs text-muted-foreground break-all">
          {link || "Paste this link to invite players: "}
        </p>
      </CardContent>
    </Card>
  );
}
