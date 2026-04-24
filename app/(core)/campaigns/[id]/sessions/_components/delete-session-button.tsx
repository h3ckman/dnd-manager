"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteSessionLog } from "@/lib/actions/sessions";

export function DeleteSessionButton({
  sessionLogId,
  title,
}: {
  sessionLogId: string;
  title: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete "${title}"?`)) return;
        startTransition(async () => {
          const res = await deleteSessionLog(sessionLogId);
          if (res.error) toast.error(res.error);
          else toast.success("Deleted");
        });
      }}
    >
      <Trash2Icon className="size-4" />
    </Button>
  );
}
