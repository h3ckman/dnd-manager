"use client";

import { useEffect, useTransition } from "react";
import { toast } from "sonner";
import { PinIcon, ScrollIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { markHandoutRead, togglePinHandout } from "@/lib/actions/handouts";
import { renderMarkdown } from "@/lib/markdown";
import { format } from "date-fns";

export function HandoutCard({
  handoutId,
  title,
  body,
  createdAt,
  authorName,
  campaignName,
  pinned,
  wasUnread,
}: {
  handoutId: string;
  title: string;
  body: string;
  createdAt: Date;
  authorName: string;
  campaignName: string;
  pinned: boolean;
  wasUnread: boolean;
}) {
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!wasUnread) return;
    startTransition(async () => {
      await markHandoutRead(handoutId);
    });
  }, [handoutId, wasUnread]);

  function togglePin() {
    startTransition(async () => {
      const res = await togglePinHandout(handoutId);
      if (res.error) toast.error(res.error);
    });
  }

  const rendered = renderMarkdown(body);

  return (
    <Card className="border-amber-500/30 bg-amber-500/5">
      <CardContent className="flex flex-col gap-2 py-4">
        <div className="flex items-center gap-2">
          <ScrollIcon className="size-4 text-amber-600" />
          <span className="text-xs uppercase tracking-wide text-amber-700">
            From DM · {campaignName} · {authorName}
          </span>
          <span className="ml-auto text-xs text-muted-foreground">
            {format(createdAt, "MMM d, yyyy")}
          </span>
          {wasUnread && (
            <span className="rounded-md bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-700">
              New
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            disabled={pending}
            onClick={togglePin}
            title={pinned ? "Unpin" : "Pin"}
          >
            <PinIcon
              className={`size-4 ${pinned ? "text-amber-500" : ""}`}
            />
          </Button>
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {body && (
          <div
            className="prose-sm max-w-none text-sm [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-2"
            dangerouslySetInnerHTML={{ __html: rendered }}
          />
        )}
      </CardContent>
    </Card>
  );
}
