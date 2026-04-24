import Link from "next/link";
import { requireCampaignMember } from "@/lib/campaigns/access";
import { Card } from "@/components/ui/card";

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
    { href: "", label: "Overview" },
    { href: "roster", label: "Roster" },
    { href: "handouts", label: "Handouts" },
    { href: "sessions", label: "Session Log" },
    ...(role === "DM" ? [{ href: "settings", label: "Settings" }] : []),
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

      <Card className="flex flex-row gap-1 p-1">
        {tabs.map((t) => (
          <Link
            key={t.href || "overview"}
            href={`/campaigns/${id}${t.href ? `/${t.href}` : ""}`}
            className="flex-1 rounded-md px-3 py-1.5 text-center text-sm hover:bg-muted"
          >
            {t.label}
          </Link>
        ))}
      </Card>

      {children}
    </div>
  );
}
