import { prisma } from "@/lib/prisma";
import { requireCampaignMember } from "@/lib/campaigns/access";
import { Card, CardContent } from "@/components/ui/card";
import { EditablePremise } from "./_components/editable-premise";

export default async function CampaignOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { campaign, role } = await requireCampaignMember(id);

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

      <EditablePremise
        campaignId={id}
        name={campaign.name}
        setting={campaign.setting}
        premise={campaign.premise}
        canEdit={role === "DM"}
      />
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
