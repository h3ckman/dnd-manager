"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteCampaign } from "@/lib/actions/campaigns";

export function DeleteCampaignButton({
  campaignId,
  name,
}: {
  campaignId: string;
  name: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function remove() {
    if (
      !confirm(
        `Delete "${name}"? This removes all memberships, handouts, and session logs. This cannot be undone.`,
      )
    )
      return;
    startTransition(async () => {
      const res = await deleteCampaign(campaignId);
      if (res.error) toast.error(res.error);
      else {
        toast.success("Campaign deleted");
        router.push("/campaigns");
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Danger zone</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          variant="outline"
          className="text-destructive"
          onClick={remove}
          disabled={pending}
        >
          <Trash2Icon className="size-4" />
          Delete campaign
        </Button>
      </CardContent>
    </Card>
  );
}
