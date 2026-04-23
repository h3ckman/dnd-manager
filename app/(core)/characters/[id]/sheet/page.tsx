import { requireCharacter } from "@/lib/characters/access";
import { prisma } from "@/lib/prisma";
import { ABILITY_NAMES, SKILLS, proficiencyBonus } from "@/lib/dnd";
import type {
  AbilityName,
  SkillName,
} from "@/lib/generated/prisma/client";
import { AbilityScores } from "./_components/ability-scores";
import { SavingThrows } from "./_components/saving-throws";
import { SkillsTable } from "./_components/skills-table";
import { HpPanel } from "./_components/hp-panel";
import { CombatStats } from "./_components/combat-stats";
import { XpTracker } from "./_components/xp-tracker";
import { RestPanel } from "./_components/rest-panel";
import { ConditionsPanel } from "./_components/conditions-panel";

export default async function SheetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireCharacter(id);

  const [character, abilities, saves, skills, conditions] = await Promise.all([
    prisma.character.findUniqueOrThrow({ where: { id } }),
    prisma.abilityScore.findMany({ where: { characterId: id } }),
    prisma.savingThrow.findMany({ where: { characterId: id } }),
    prisma.skillProficiency.findMany({ where: { characterId: id } }),
    prisma.condition.findMany({
      where: { characterId: id },
      orderBy: { name: "asc" },
    }),
  ]);

  const scoreMap = {} as Record<AbilityName, number>;
  for (const a of ABILITY_NAMES) scoreMap[a] = 10;
  for (const row of abilities) scoreMap[row.ability] = row.score;

  const saveMap = {} as Record<AbilityName, boolean>;
  for (const a of ABILITY_NAMES) saveMap[a] = false;
  for (const row of saves) saveMap[row.ability] = row.proficient;

  const skillMap = {} as Record<
    SkillName,
    { proficient: boolean; expertise: boolean }
  >;
  for (const s of SKILLS) {
    skillMap[s.name] = { proficient: false, expertise: false };
  }
  for (const row of skills) {
    skillMap[row.skill] = {
      proficient: row.proficient,
      expertise: row.expertise,
    };
  }

  const profBonus = proficiencyBonus(character.level);

  return (
    <div className="flex flex-col gap-6">
      <AbilityScores characterId={id} scores={scoreMap} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-4">
          <HpPanel
            characterId={id}
            currentHp={character.currentHp}
            maxHp={character.maxHp}
            tempHp={character.tempHp}
            inspiration={character.inspiration}
          />
          <CombatStats
            characterId={id}
            armorClass={character.armorClass}
            maxHp={character.maxHp}
            tempHp={character.tempHp}
            hitDieType={character.hitDieType}
            speed={character.speed}
            initiativeScore={scoreMap.DEX}
            proficiencyBonus={profBonus}
          />
          <ConditionsPanel characterId={id} conditions={conditions} />
        </div>
        <div className="flex flex-col gap-4">
          <SavingThrows
            characterId={id}
            scores={scoreMap}
            proficiencies={saveMap}
            proficiencyBonus={profBonus}
          />
          <XpTracker
            characterId={id}
            experience={character.experience}
            level={character.level}
          />
          <RestPanel
            characterId={id}
            hitDieType={character.hitDieType}
            hitDiceTotal={character.hitDiceTotal}
            hitDiceUsed={character.hitDiceUsed}
            conScore={scoreMap.CON}
            level={character.level}
          />
        </div>
        <SkillsTable
          characterId={id}
          scores={scoreMap}
          skills={skillMap}
          proficiencyBonus={profBonus}
        />
      </div>
    </div>
  );
}
