"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteCharacter } from "@/lib/actions/characters";

export function DeleteCharacterButton({
  characterId,
  name,
}: {
  characterId: string;
  name: string;
}) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
        startTransition(async () => {
          const res = await deleteCharacter(characterId);
          if (res.error) toast.error(res.error);
          else toast.success(`${name} deleted`);
        });
      }}
    >
      <Trash2Icon className="size-4" />
    </Button>
  );
}
