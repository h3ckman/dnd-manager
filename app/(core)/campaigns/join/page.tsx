import Link from "next/link";
import { requireAuth } from "@/lib/auth/can";
import { prisma } from "@/lib/prisma";
import { listCharactersForUser } from "@/lib/characters/access";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JoinForm } from "./_components/join-form";

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const session = await requireAuth();
  const { code } = await searchParams;

  if (!code) {
    return (
      <div className="mx-auto max-w-md py-10">
        <Card>
          <CardHeader>
            <CardTitle>Join a campaign</CardTitle>
            <CardDescription>
              Ask your DM for an invite link. It should look like{" "}
              <code>/campaigns/join?code=XXX-YYY</code>.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const campaign = await prisma.campaign.findUnique({
    where: { inviteCode: code },
    include: {
      dm: { select: { name: true } },
      _count: { select: { memberships: true } },
    },
  });

  if (!campaign) {
    return (
      <div className="mx-auto max-w-md py-10">
        <Card>
          <CardHeader>
            <CardTitle>Invite not found</CardTitle>
            <CardDescription>
              This invite code is invalid or has been regenerated. Ask your DM
              for a fresh link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/campaigns" className="text-sm underline">
              Back to campaigns
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const existing = await prisma.campaignMembership.findUnique({
    where: {
      campaignId_userId: {
        campaignId: campaign.id,
        userId: session.user.id,
      },
    },
    select: { role: true },
  });

  const characters = await listCharactersForUser(session.user.id);

  return (
    <div className="mx-auto max-w-md py-10">
      <Card>
        <CardHeader>
          <CardTitle>{campaign.name}</CardTitle>
          <CardDescription>
            DM: {campaign.dm.name} · {campaign._count.memberships} member
            {campaign._count.memberships === 1 ? "" : "s"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {campaign.setting && (
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Setting
              </div>
              <div className="text-sm">{campaign.setting}</div>
            </div>
          )}
          {campaign.premise && (
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Premise
              </div>
              <p className="whitespace-pre-wrap text-sm">{campaign.premise}</p>
            </div>
          )}
          {existing ? (
            <div className="rounded-md bg-muted p-3 text-sm">
              You&apos;re already a member ({existing.role.toLowerCase()}).{" "}
              <Link
                href={`/campaigns/${campaign.id}`}
                className="font-medium underline"
              >
                Open campaign
              </Link>
            </div>
          ) : (
            <JoinForm code={code} characters={characters} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
