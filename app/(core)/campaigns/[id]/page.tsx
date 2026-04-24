import { prisma } from "@/lib/prisma";
import { requireCampaignMember } from "@/lib/campaigns/access";
import { Card, CardContent } from "@/components/ui/card";
import { EditablePremise } from "./_components/editable-premise";
import {
  BookOpenIcon,
  CrownIcon,
  SendIcon,
  UsersIcon,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default async function CampaignOverviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { campaign, role } = await requireCampaignMember(id);

  const [memberCount, handoutCount, sessionCount, latestHandout, latestSession, dm] =
    await Promise.all([
      prisma.campaignMembership.count({ where: { campaignId: id } }),
      prisma.handout.count({ where: { campaignId: id } }),
      prisma.sessionLog.count({ where: { campaignId: id } }),
      prisma.handout.findFirst({
        where: { campaignId: id },
        orderBy: { createdAt: "desc" },
        select: { createdAt: true },
      }),
      prisma.sessionLog.findFirst({
        where: { campaignId: id },
        orderBy: [{ sessionDate: "desc" }, { createdAt: "desc" }],
        select: { title: true, sessionDate: true, createdAt: true },
      }),
      prisma.user.findUnique({
        where: { id: campaign.dmUserId },
        select: { name: true },
      }),
    ]);

  const playerCount = Math.max(0, memberCount - 1);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat
          icon={<CrownIcon className="size-5 text-amber-500" />}
          label="Dungeon Master"
          value={dm?.name ?? "Unknown"}
          subtext={`Running since ${format(campaign.createdAt, "MMM yyyy")}`}
        />
        <Stat
          icon={<UsersIcon className="size-5 text-sky-500" />}
          label="Members"
          value={String(memberCount)}
          subtext={`${playerCount} player${playerCount === 1 ? "" : "s"} · 1 DM`}
        />
        <Stat
          icon={<SendIcon className="size-5 text-violet-500" />}
          label="Handouts"
          value={String(handoutCount)}
          subtext={
            latestHandout
              ? `Last sent ${formatDistanceToNow(latestHandout.createdAt, { addSuffix: true })}`
              : "None sent yet"
          }
        />
        <Stat
          icon={<BookOpenIcon className="size-5 text-emerald-500" />}
          label="Sessions"
          value={String(sessionCount)}
          subtext={
            latestSession
              ? `Last: ${latestSession.title}`
              : "No entries yet"
          }
        />
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

function Stat({
  icon,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <Card>
      <CardContent className="flex items-start gap-3 py-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
          {icon}
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </span>
          <span className="truncate text-lg font-bold leading-tight">
            {value}
          </span>
          <span className="mt-0.5 truncate text-xs text-muted-foreground">
            {subtext}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
