import { requireCampaignMember } from "@/lib/campaigns/access";
import { TabBar } from "@/app/(core)/_components/tab-bar";

export default async function CampaignLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { campaign, role } = await requireCampaignMember(id);

  const tabs = [
    { href: `/campaigns/${id}`, label: "Overview" },
    { href: `/campaigns/${id}/roster`, label: "Roster" },
    { href: `/campaigns/${id}/handouts`, label: "Handouts" },
    { href: `/campaigns/${id}/sessions`, label: "Session Log" },
    ...(role === "DM"
      ? [{ href: `/campaigns/${id}/settings`, label: "Settings" }]
      : []),
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight">{campaign.name}</h1>
          <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {role === "DM" ? "You DM" : "Player"}
          </span>
        </div>
        {campaign.setting && (
          <p className="text-xs text-muted-foreground">{campaign.setting}</p>
        )}
      </header>

      <TabBar tabs={tabs} />

      {children}
    </div>
  );
}
