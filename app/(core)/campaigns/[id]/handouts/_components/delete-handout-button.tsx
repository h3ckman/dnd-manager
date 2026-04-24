"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteHandout } from "@/lib/actions/handouts";

export function DeleteHandoutButton({
  handoutId,
  title,
}: {
  handoutId: string;
  title: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete "${title}"? All recipients lose access.`)) return;
        startTransition(async () => {
          const res = await deleteHandout(handoutId);
          if (res.error) toast.error(res.error);
          else toast.success("Handout deleted");
        });
      }}
    >
      <Trash2Icon className="size-4" />
    </Button>
  );
}
