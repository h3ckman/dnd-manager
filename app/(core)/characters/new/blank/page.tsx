import { requireAuth } from "@/lib/auth/can";
import { listPresetPortraits } from "@/lib/characters/portraits";
import { BlankForm } from "../_components/blank-form";

export default async function BlankCharacterPage() {
  await requireAuth();
  const presets = await listPresetPortraits();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Blank character</h1>
        <p className="text-sm text-muted-foreground">
          A clean level-1 sheet. You&apos;ll fill in stats, equipment, and
          spells from the character sheet after creation.
        </p>
      </div>
      <BlankForm presets={presets} />
    </div>
  );
}
