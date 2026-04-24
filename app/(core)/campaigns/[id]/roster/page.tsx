import { prisma } from "@/lib/prisma";
import { requireCampaignMember } from "@/lib/campaigns/access";
import { listCharactersForUser } from "@/lib/characters/access";
import { Card, CardContent } from "@/components/ui/card";
import { Portrait } from "@/app/(core)/_components/portrait";
import { AssignCharacterDialog } from "./_components/assign-character-dialog";
import { RemoveMemberButton } from "./_components/remove-member-button";
import { CharacterStatus } from "./_components/character-status";

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
          subclass: true,
          level: true,
          portraitUrl: true,
          armorClass: true,
          maxHp: true,
          currentHp: true,
          tempHp: true,
          speed: true,
          inspiration: true,
          abilities: { select: { ability: true, score: true } },
          skills: {
            select: { skill: true, proficient: true, expertise: true },
            where: { skill: "PERCEPTION" },
          },
          conditions: {
            select: { id: true, name: true, level: true },
            orderBy: { name: "asc" },
          },
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
            <CardContent className="flex items-start gap-3 py-3">
              <Portrait
                src={m.character?.portraitUrl ?? null}
                alt={m.character?.name ?? m.user.name}
                size={40}
                fallbackText={m.user.name}
              />
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-medium">{m.user.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {isDm ? "DM" : "Player"}
                    {isSelf ? " · you" : ""}
                  </span>
                </div>
                {m.character ? (
                  <>
                    <div className="text-xs text-muted-foreground">
                      Playing:{" "}
                      <span className="font-medium text-foreground">
                        {m.character.name}
                      </span>{" "}
                      · Lvl {m.character.level} {m.character.race}{" "}
                      {m.character.characterClass}
                      {m.character.subclass ? ` (${m.character.subclass})` : ""}
                    </div>
                    <CharacterStatus character={m.character} />
                  </>
                ) : (
                  <div className="text-xs text-muted-foreground">
                    {isDm
                      ? "No character (DM)"
                      : "No character assigned yet"}
                  </div>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
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
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
