import { prisma } from "@/lib/prisma";
import { requireCampaignMember } from "@/lib/campaigns/access";
import { listCharactersForUser } from "@/lib/characters/access";
import { Card, CardContent } from "@/components/ui/card";
import { AssignCharacterDialog } from "./_components/assign-character-dialog";
import { RemoveMemberButton } from "./_components/remove-member-button";

export default async function RosterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { role, userId } = await requireCampaignMember(id);

  const members = await prisma.campaignMembership.findMany({
    where: { campaignId: id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      character: {
        select: {
          id: true,
          name: true,
          race: true,
          characterClass: true,
          level: true,
        },
      },
    },
    orderBy: [{ role: "asc" }, { joinedAt: "asc" }],
  });

  const myCharacters = await listCharactersForUser(userId);

  return (
    <div className="flex flex-col gap-3">
      {members.map((m) => {
        const isSelf = m.userId === userId;
        const isDm = m.role === "DM";
        return (
          <Card key={m.id}>
            <CardContent className="flex items-center gap-3 py-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                {m.user.name.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">{m.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {isDm ? "DM" : "Player"}
                    {isSelf ? " · you" : ""}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {m.character
                    ? `Playing: ${m.character.name} (Lvl ${m.character.level} ${m.character.race} ${m.character.characterClass})`
                    : isDm
                      ? "No character (DM)"
                      : "No character assigned yet"}
                </div>
              </div>
              {isSelf && !isDm && (
                <AssignCharacterDialog
                  campaignId={id}
                  currentCharacterId={m.characterId}
                  characters={myCharacters}
                />
              )}
              {role === "DM" && !isSelf && (
                <RemoveMemberButton
                  campaignId={id}
                  userId={m.userId}
                  name={m.user.name}
                />
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
