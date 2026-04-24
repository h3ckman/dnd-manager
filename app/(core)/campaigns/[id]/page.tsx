import { prisma } from "@/lib/prisma";
import { requireCampaignMember } from "@/lib/campaigns/access";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function CampaignOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { campaign } = await requireCampaignMember(id);

  const [memberCount, handoutCount, sessionCount] = await Promise.all([
    prisma.campaignMembership.count({ where: { campaignId: id } }),
    prisma.handout.count({ where: { campaignId: id } }),
    prisma.sessionLog.count({ where: { campaignId: id } }),
  ]);

  const dm = await prisma.user.findUnique({
    where: { id: campaign.dmUserId },
    select: { name: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label="Dungeon Master" value={dm?.name ?? "Unknown"} />
        <Stat label="Members" value={String(memberCount)} />
        <Stat label="Handouts" value={String(handoutCount)} />
        <Stat label="Sessions" value={String(sessionCount)} />
      </div>

      {campaign.premise && (
        <Card>
          <CardHeader>
            <CardTitle>Premise</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm">{campaign.premise}</p>
          </CardContent>
        </Card>
      )}

      {!campaign.premise && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No premise yet. The DM can add one in settings.
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="mt-1 text-lg font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}
