import Link from "next/link";
import { requireAuth } from "@/lib/auth/can";
import { listCampaignsForUser } from "@/lib/campaigns/access";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { NewCampaignDialog } from "./_components/new-campaign-dialog";
import { format } from "date-fns";

export default async function CampaignsPage() {
  const session = await requireAuth();
  const campaigns = await listCampaignsForUser(session.user.id);

  const asDm = campaigns.filter((c) => c.role === "DM");
  const asPlayer = campaigns.filter((c) => c.role === "PLAYER");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-sm text-muted-foreground">
            Campaigns you DM and games you&apos;re playing in.
          </p>
        </div>
        <NewCampaignDialog />
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No campaigns yet. Create one to DM, or paste an invite link to
              join.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {asDm.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                DM
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {asDm.map((c) => (
                  <CampaignCard key={c.id} campaign={c} />
                ))}
              </div>
            </section>
          )}
          {asPlayer.length > 0 && (
            <section className="flex flex-col gap-3">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Player
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {asPlayer.map((c) => (
                  <CampaignCard key={c.id} campaign={c} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}

function CampaignCard({
  campaign,
}: {
  campaign: {
    id: string;
    name: string;
    role: "DM" | "PLAYER";
    memberCount: number;
    dmName: string;
    updatedAt: Date;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`/campaigns/${campaign.id}`} className="hover:underline">
            {campaign.name}
          </Link>
        </CardTitle>
        <CardDescription>
          {campaign.role === "DM" ? "You DM" : `DM: ${campaign.dmName}`} ·{" "}
          {campaign.memberCount} member{campaign.memberCount === 1 ? "" : "s"}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        Updated {format(campaign.updatedAt, "MMM d, yyyy")}
      </CardContent>
    </Card>
  );
}
