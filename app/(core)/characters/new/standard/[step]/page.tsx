import { notFound } from "next/navigation";
import { ALL_STEPS, type StepSlug } from "../_components/wizard-steps";
import { IdentityStep } from "../_components/steps/identity-step";
import { AbilitiesStep } from "../_components/steps/abilities-step";
import { SkillsStep } from "../_components/steps/skills-step";
import { EquipmentStep } from "../_components/steps/equipment-step";
import { SpellsStep } from "../_components/steps/spells-step";
import { TraitsStep } from "../_components/steps/traits-step";
import { ReviewStep } from "../_components/steps/review-step";

const VALID_SLUGS = new Set<StepSlug>(ALL_STEPS.map((s) => s.slug));

export default async function StandardStepPage({
  params,
}: {
  params: Promise<{ step: string }>;
}) {
  const { step } = await params;
  if (!VALID_SLUGS.has(step as StepSlug)) notFound();

  switch (step as StepSlug) {
    case "identity":
      return <IdentityStep />;
    case "abilities":
      return <AbilitiesStep />;
    case "skills":
      return <SkillsStep />;
    case "equipment":
      return <EquipmentStep />;
    case "spells":
      return <SpellsStep />;
    case "traits":
      return <TraitsStep />;
    case "review":
      return <ReviewStep />;
    default:
      notFound();
  }
}
