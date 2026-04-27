import type { CharacterDraft } from "@/lib/characters/draft-types";
import { getClass } from "@/lib/dnd";

export const ALL_STEPS = [
  { slug: "identity", label: "Identity" },
  { slug: "abilities", label: "Abilities" },
  { slug: "skills", label: "Skills" },
  { slug: "equipment", label: "Equipment" },
  { slug: "spells", label: "Spells" },
  { slug: "traits", label: "Traits" },
  { slug: "review", label: "Review" },
] as const;

export type StepSlug = (typeof ALL_STEPS)[number]["slug"];

export function isCasterClass(className: string): boolean {
  const def = getClass(className);
  return !!def && def.caster !== "none";
}

export function visibleSteps(draft: CharacterDraft): readonly { slug: StepSlug; label: string }[] {
  if (isCasterClass(draft.identity.characterClass)) return ALL_STEPS;
  return ALL_STEPS.filter((s) => s.slug !== "spells");
}

export function nextStep(current: StepSlug, draft: CharacterDraft): StepSlug | null {
  const steps = visibleSteps(draft);
  const idx = steps.findIndex((s) => s.slug === current);
  if (idx < 0 || idx >= steps.length - 1) return null;
  return steps[idx + 1].slug;
}

export function prevStep(current: StepSlug, draft: CharacterDraft): StepSlug | null {
  const steps = visibleSteps(draft);
  const idx = steps.findIndex((s) => s.slug === current);
  if (idx <= 0) return null;
  return steps[idx - 1].slug;
}
