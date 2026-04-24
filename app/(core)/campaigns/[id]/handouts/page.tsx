import { prisma } from "@/lib/prisma";
import { requireCampaignMember } from "@/lib/campaigns/access";
import { renderMarkdown } from "@/lib/markdown";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ComposeHandoutDialog } from "./_components/compose-handout-dialog";
import { DeleteHandoutButton } from "./_components/delete-handout-button";
import { format } from "date-fns";

export default async function HandoutsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { role, userId } = await requireCampaignMember(id);

  const players = await prisma.campaignMembership.findMany({
    where: { campaignId: id, role: "PLAYER" },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { joinedAt: "asc" },
  });

  const handouts =
    role === "DM"
      ? await prisma.handout.findMany({
          where: { campaignId: id },
          include: {
            recipients: {
              include: { user: { select: { id: true, name: true } } },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : await prisma.handout.findMany({
          where: {
            campaignId: id,
            recipients: { some: { userId } },
          },
          include: {
            author: { select: { name: true } },
            recipients: {
              where: { userId },
              select: { pinned: true, readAt: true },
            },
          },
          orderBy: { createdAt: "desc" },
        });

  return (
    <div className="flex flex-col gap-4">
      {role === "DM" && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Send note-style handouts to all players or specific ones. They
            show up in the player&apos;s character Notes.
          </p>
          <ComposeHandoutDialog
            campaignId={id}
            players={players.map((p) => ({
              userId: p.user.id,
              name: p.user.name,
            }))}
          />
        </div>
      )}

      {handouts.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {role === "DM"
              ? "No handouts sent yet."
              : "No handouts for you yet."}
          </CardContent>
        </Card>
      ) : (
        handouts.map((h) => {
          const rendered = renderMarkdown(h.body);
          const recipientNames =
            role === "DM" && "recipients" in h
              ? h.recipients
                  .map((r) => {
                    const u = (
                      r as unknown as { user: { name: string } }
                    ).user;
                    return u?.name ?? "?";
                  })
                  .join(", ")
              : null;
          return (
            <Card key={h.id}>
              <CardHeader>
                <CardTitle>{h.title}</CardTitle>
                <CardDescription>
                  {format(h.createdAt, "MMM d, yyyy p")}
                  {recipientNames && ` · To: ${recipientNames}`}
                </CardDescription>
                {role === "DM" && (
                  <CardAction>
                    <DeleteHandoutButton handoutId={h.id} title={h.title} />
                  </CardAction>
                )}
              </CardHeader>
              <CardContent>
                {h.body && (
                  <div
                    className="prose-sm max-w-none text-sm [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-2"
                    dangerouslySetInnerHTML={{ __html: rendered }}
                  />
                )}
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
