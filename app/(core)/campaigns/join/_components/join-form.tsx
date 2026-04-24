"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { joinCampaignByCode } from "@/lib/actions/campaigns";

export function JoinForm({
  code,
  characters,
}: {
  code: string;
  characters: { id: string; name: string; race: string; characterClass: string }[];
}) {
  const router = useRouter();
  const [characterId, setCharacterId] = useState<string>(
    characters[0]?.id ?? "",
  );
  const [pending, startTransition] = useTransition();

  function submit() {
    startTransition(async () => {
      const res = await joinCampaignByCode(code, characterId || undefined);
      if (res.data) {
        toast.success("Joined campaign");
        router.push(`/campaigns/${res.data.campaignId}`);
      } else {
        toast.error(res.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-4">
      {characters.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You don&apos;t have any characters yet. You can still join and
          assign one later.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          <Label htmlFor="join-char">Play as</Label>
          <select
            id="join-char"
            value={characterId}
            onChange={(e) => setCharacterId(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">Decide later</option>
            {characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} — {c.race} {c.characterClass}
              </option>
            ))}
          </select>
        </div>
      )}
      <Button onClick={submit} disabled={pending}>
        {pending ? "Joining…" : "Join campaign"}
      </Button>
    </div>
  );
}
