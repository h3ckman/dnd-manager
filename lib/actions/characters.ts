"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import {
  clearActiveCharacterId,
  writeActiveCharacterId,
} from "@/lib/characters/active";
import { ABILITY_NAMES, SKILLS, getClass, getRace } from "@/lib/dnd";

type ActionResult<T> =
  | { data: T; error: null }
  | { data: null; error: string };

const PortraitSchema = z
  .string()
  .max(800_000, "Portrait too large")
  .refine(
    (v) => v.startsWith("/portraits/") || v.startsWith("data:image/"),
    "Portrait must be a preset path or image data URL",
  );

const CreateSchema = z.object({
  name: z.string().min(1, "Name required").max(60),
  race: z.string().min(1, "Race required"),
  subrace: z.string().optional(),
  characterClass: z.string().min(1, "Class required"),
  subclass: z.string().optional(),
  background: z.string().min(1, "Background required"),
  alignment: z.string().min(1, "Alignment required"),
  portraitUrl: PortraitSchema.optional(),
});

export async function createCharacter(
  _prev: { error: string | null } | undefined,
  formData: FormData,
): Promise<{ error: string | null }> {
  const session = await getSession();
  if (!session) return { error: "Unauthorized" };

  const parsed = CreateSchema.safeParse({
    name: formData.get("name"),
    race: formData.get("race"),
    subrace: formData.get("subrace") || undefined,
    characterClass: formData.get("characterClass"),
    subclass: formData.get("subclass") || undefined,
    background: formData.get("background"),
    alignment: formData.get("alignment"),
    portraitUrl: formData.get("portraitUrl") || undefined,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const classDef = getClass(parsed.data.characterClass);
  const raceDef = getRace(parsed.data.race);

  const character = await prisma.character.create({
    data: {
      userId: session.user.id,
      name: parsed.data.name,
      race: parsed.data.race,
      subrace: parsed.data.subrace,
      characterClass: parsed.data.characterClass,
      subclass: parsed.data.subclass,
      background: parsed.data.background,
      alignment: parsed.data.alignment,
      portraitUrl: parsed.data.portraitUrl,
      level: 1,
      hitDieType: classDef?.hitDie ?? 8,
      hitDiceTotal: 1,
      maxHp: classDef ? classDef.hitDie + 0 : 8,
      currentHp: classDef ? classDef.hitDie + 0 : 8,
      speed: raceDef?.speed ?? 30,
      spellcastingAbility: classDef?.spellcastingAbility ?? null,
      abilities: {
        create: ABILITY_NAMES.map((ability) => ({ ability, score: 10 })),
      },
      savingThrows: {
        create: ABILITY_NAMES.map((ability) => ({
          ability,
          proficient: classDef?.savingThrows.includes(ability) ?? false,
        })),
      },
      skills: {
        create: SKILLS.map((s) => ({ skill: s.name })),
      },
    },
    select: { id: true },
  });

  await writeActiveCharacterId(character.id);
  revalidatePath("/characters");
  revalidatePath("/", "layout");
  return { error: null };
}

export async function selectCharacter(characterId: string): Promise<void> {
  const session = await getSession();
  if (!session) redirect("/login");
  const exists = await prisma.character.findFirst({
    where: { id: characterId, userId: session.user.id },
    select: { id: true },
  });
  if (!exists) redirect("/characters");
  await writeActiveCharacterId(characterId);
  revalidatePath("/", "layout");
}

export async function deleteCharacter(
  characterId: string,
): Promise<ActionResult<{ id: string }>> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const existing = await prisma.character.findFirst({
    where: { id: characterId, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) return { data: null, error: "Character not found" };

  await prisma.character.delete({ where: { id: characterId } });
  await clearActiveCharacterId();
  revalidatePath("/characters");
  revalidatePath("/", "layout");
  return { data: { id: characterId }, error: null };
}

const IdentitySchema = z.object({
  name: z.string().min(1).max(60),
  race: z.string().min(1),
  subrace: z.string().optional(),
  characterClass: z.string().min(1),
  subclass: z.string().optional(),
  background: z.string().min(1),
  alignment: z.string().min(1),
  personality: z.string().optional(),
  ideals: z.string().optional(),
  bonds: z.string().optional(),
  flaws: z.string().optional(),
  backstory: z.string().optional(),
  appearance: z.string().optional(),
});

export async function updateCharacterIdentity(
  characterId: string,
  input: z.infer<typeof IdentitySchema>,
): Promise<ActionResult<{ id: string }>> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  const parsed = IdentitySchema.safeParse(input);
  if (!parsed.success) {
    return { data: null, error: parsed.error.issues[0]?.message ?? "Invalid" };
  }

  const existing = await prisma.character.findFirst({
    where: { id: characterId, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) return { data: null, error: "Character not found" };

  await prisma.character.update({
    where: { id: characterId },
    data: parsed.data,
  });
  revalidatePath(`/characters/${characterId}`);
  revalidatePath("/", "layout");
  return { data: { id: characterId }, error: null };
}

export async function updateCharacterPortrait(
  characterId: string,
  portraitUrl: string | null,
): Promise<ActionResult<{ id: string }>> {
  const session = await getSession();
  if (!session) return { data: null, error: "Unauthorized" };

  if (portraitUrl !== null) {
    const parsed = PortraitSchema.safeParse(portraitUrl);
    if (!parsed.success) {
      return {
        data: null,
        error: parsed.error.issues[0]?.message ?? "Invalid portrait",
      };
    }
  }

  const existing = await prisma.character.findFirst({
    where: { id: characterId, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) return { data: null, error: "Character not found" };

  await prisma.character.update({
    where: { id: characterId },
    data: { portraitUrl },
  });
  revalidatePath(`/characters/${characterId}`, "layout");
  revalidatePath("/", "layout");
  return { data: { id: characterId }, error: null };
}
