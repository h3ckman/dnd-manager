import { prisma } from "@/lib/prisma";
import { requireCharacter } from "@/lib/characters/access";
import { AddSpellDialog } from "./_components/add-spell-dialog";
import { SlotTrack } from "./_components/slot-track";
import { SpellList } from "./_components/spell-list";
import {
  ABILITY_LABELS,
  abilityModifier,
  formatModifier,
  proficiencyBonus,
} from "@/lib/dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SpellsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireCharacter(id);

  const [character, abilities, spells] = await Promise.all([
    prisma.character.findUniqueOrThrow({ where: { id } }),
    prisma.abilityScore.findMany({ where: { characterId: id } }),
    prisma.spell.findMany({
      where: { characterId: id },
      orderBy: [{ level: "asc" }, { name: "asc" }],
    }),
  ]);

  const slots = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
    max: character[`slot${n}Max` as keyof typeof character] as number,
    used: character[`slot${n}Used` as keyof typeof character] as number,
  }));

  const spellAbility = character.spellcastingAbility;
  const abilityScore = spellAbility
    ? abilities.find((a) => a.ability === spellAbility)?.score ?? 10
    : null;
  const profBonus = proficiencyBonus(character.level);
  const spellMod =
    abilityScore !== null ? abilityModifier(abilityScore) : null;
  const spellDc = spellMod !== null ? 8 + profBonus + spellMod : null;
  const spellAttack = spellMod !== null ? profBonus + spellMod : null;

  return (
    <div className="flex flex-col gap-4">
      {spellAbility && (
        <Card>
          <CardHeader>
            <CardTitle>Spellcasting</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3 text-sm">
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Ability
              </div>
              <div className="font-medium">{ABILITY_LABELS[spellAbility]}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Save DC
              </div>
              <div className="font-medium">{spellDc}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                Attack Bonus
              </div>
              <div className="font-medium">
                {spellAttack !== null ? formatModifier(spellAttack) : "—"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <SlotTrack characterId={id} slots={slots} />

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Spells</h2>
        <AddSpellDialog characterId={id} />
      </div>

      <SpellList characterId={id} spells={spells} />
    </div>
  );
}
