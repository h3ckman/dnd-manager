"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Trash2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteFeature } from "@/lib/actions/features";
import type { Feature } from "@/lib/generated/prisma/client";

export function FeatureList({
  characterId,
  features,
}: {
  characterId: string;
  features: Feature[];
}) {
  const [pending, startTransition] = useTransition();

  function remove(id: string, name: string) {
    if (!confirm(`Delete ${name}?`)) return;
    startTransition(async () => {
      const res = await deleteFeature(characterId, id);
      if (res.error) toast.error(res.error);
    });
  }

  if (features.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          No features yet. Add class features, racial traits, and feats.
        </CardContent>
      </Card>
    );
  }

  const groups = new Map<string, Feature[]>();
  for (const f of features) {
    const key = f.source;
    const arr = groups.get(key) ?? [];
    arr.push(f);
    groups.set(key, arr);
  }

  return (
    <div className="flex flex-col gap-4">
      {[...groups.entries()].map(([source, group]) => (
        <div key={source} className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            {source}
          </h3>
          {group.map((f) => (
            <Card key={f.id}>
              <CardContent className="flex items-start gap-3 py-3">
                <div className="flex-1">
                  <div className="font-medium">{f.name}</div>
                  {f.description && (
                    <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                      {f.description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={pending}
                  onClick={() => remove(f.id, f.name)}
                >
                  <Trash2Icon className="size-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ))}
    </div>
  );
}
