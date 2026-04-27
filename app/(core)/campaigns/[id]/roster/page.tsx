import { prisma } from "@/lib/prisma";
import { requireCampaignMember } from "@/lib/campaigns/access";
import { listCharactersForUser } from "@/lib/characters/access";
import { ItemGroup } from "@/components/ui/item";
import { CharacterItem } from "@/components/character-item";
import { abilityModifier } from "@/lib/dnd/abilities";
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
          portraitUrl: true,
          armorClass: true,
          maxHp: true,
          currentHp: true,
          tempHp: true,
          gold: true,
          updatedAt: true,
          speed: true,
          abilities: {
            where: { ability: "DEX" },
            select: { score: true },
          },
        },
      },
    },
    orderBy: [{ role: "asc" }, { joinedAt: "asc" }],
  });

  const myCharacters = await listCharactersForUser(userId);

  return (
    <ItemGroup className="grid grid-cols-1 gap-2 xl:grid-cols-2">
      {members.map((m) => {
        const isSelf = m.userId === userId;
        const isDm = m.role === "DM";
        const character = m.character
          ? (() => {
              const { abilities, ...rest } = m.character;
              return {
                ...rest,
                initiative: abilityModifier(abilities[0]?.score ?? 10),
              };
            })()
          : null;
        return (
          <CharacterItem
            key={m.id}
            character={character}
            fallbackName={m.user.name}
            fallbackLabel={
              isDm ? "No character (DM)" : "No character assigned yet"
            }
            header={
              <div className="flex items-baseline gap-2">
                <span className="font-medium">{m.user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {isDm ? "DM" : "Player"}
                  {isSelf ? " · you" : ""}
                </span>
              </div>
            }
            actions={
              <>
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
              </>
            }
          />
        );
      })}
    </ItemGroup>
  );
}
