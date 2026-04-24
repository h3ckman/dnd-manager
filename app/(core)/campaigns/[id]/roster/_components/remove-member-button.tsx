"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { removeMember } from "@/lib/actions/campaigns";

export function RemoveMemberButton({
  campaignId,
  userId,
  name,
}: {
  campaignId: string;
  userId: string;
  name: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Remove ${name} from this campaign?`)) return;
        startTransition(async () => {
          const res = await removeMember(campaignId, userId);
          if (res.error) toast.error(res.error);
          else toast.success(`Removed ${name}`);
        });
      }}
    >
      <Trash2Icon className="size-4" />
    </Button>
  );
}
