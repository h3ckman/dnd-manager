import { prisma } from "@/lib/prisma";
import { requireCampaignMember } from "@/lib/campaigns/access";
import { renderMarkdown } from "@/lib/markdown";
import { Card, CardContent } from "@/components/ui/card";
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
          return (
            <Card key={s.id}>
              <CardContent className="flex flex-col gap-2 py-4">
                <div className="flex items-baseline gap-2">
                  <h3 className="flex-1 text-lg font-semibold">{s.title}</h3>
                  <span className="text-xs text-muted-foreground">
                    {s.sessionDate
                      ? format(s.sessionDate, "MMM d, yyyy")
                      : format(s.createdAt, "MMM d, yyyy")}{" "}
                    · by {s.author.name}
                  </span>
                  {canDelete && (
                    <DeleteSessionButton
                      sessionLogId={s.id}
                      title={s.title}
                    />
                  )}
                </div>
                {s.body && (
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
