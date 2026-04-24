import { requireDm } from "@/lib/campaigns/access";
import { CampaignIdentityForm } from "./_components/campaign-identity-form";
import { InvitePanel } from "./_components/invite-panel";
import { DeleteCampaignButton } from "./_components/delete-campaign-button";

export default async function CampaignSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { campaign } = await requireDm(id);

  return (
    <div className="flex flex-col gap-4">
      <CampaignIdentityForm
        campaignId={id}
        initial={{
          name: campaign.name,
          setting: campaign.setting,
          premise: campaign.premise,
        }}
      />
      <InvitePanel campaignId={id} initialCode={campaign.inviteCode} />
      <DeleteCampaignButton campaignId={id} name={campaign.name} />
    </div>
  );
}
