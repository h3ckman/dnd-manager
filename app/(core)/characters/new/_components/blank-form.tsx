"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createBlankCharacter } from "@/lib/actions/characters";
import type { PresetPortrait } from "@/lib/characters/portraits";
import { IdentityFields } from "./identity-fields";

export function BlankForm({ presets }: { presets: PresetPortrait[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await createBlankCharacter(undefined, formData);
      if (res.error) {
        toast.error(res.error);
        return;
      }
      toast.success("Character created");
      router.push("/characters");
    });
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-6">
      <IdentityFields presets={presets} />
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/characters/new")}
        >
          Back
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create character"}
        </Button>
      </div>
    </form>
  );
}
