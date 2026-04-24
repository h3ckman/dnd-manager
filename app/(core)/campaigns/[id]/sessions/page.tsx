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
import { AddSessionDialog } from "./_components/add-session-dialog";
import { DeleteSessionButton } from "./_components/delete-session-button";
import { format } from "date-fns";

export default async function SessionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { role, userId } = await requireCampaignMember(id);

  const entries = await prisma.sessionLog.findMany({
    where: { campaignId: id },
    include: { author: { select: { name: true } } },
    orderBy: [{ sessionDate: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="flex flex-col gap-4">
      {role === "DM" && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Campaign recap that all players can read.
          </p>
          <AddSessionDialog campaignId={id} />
        </div>
      )}

      {entries.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No session entries yet.
          </CardContent>
        </Card>
      ) : (
        entries.map((s) => {
          const rendered = renderMarkdown(s.body);
          const canDelete = s.authorUserId === userId;
          const when = s.sessionDate
            ? format(s.sessionDate, "MMM d, yyyy")
            : format(s.createdAt, "MMM d, yyyy");
          return (
            <Card key={s.id}>
              <CardHeader>
                <CardTitle>{s.title}</CardTitle>
                <CardDescription>
                  {when} · by {s.author.name}
                </CardDescription>
                {canDelete && (
                  <CardAction>
                    <DeleteSessionButton
                      sessionLogId={s.id}
                      title={s.title}
                    />
                  </CardAction>
                )}
              </CardHeader>
              {s.body && (
                <CardContent>
                  <div
                    className="prose-sm max-w-none text-sm [&_a]:underline [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_h1]:text-lg [&_h1]:font-semibold [&_h2]:font-semibold [&_li]:ml-4 [&_li]:list-disc [&_ol_li]:list-decimal [&_p]:mb-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-2"
                    dangerouslySetInnerHTML={{ __html: rendered }}
                  />
                </CardContent>
              )}
            </Card>
          );
        })
      )}
    </div>
  );
}
