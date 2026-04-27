import { notFound } from "next/navigation";
import { requireAuth } from "@/lib/auth/can";
import { getCharacterPreset } from "@/lib/characters/presets";
import type { CharacterDraft } from "@/lib/characters/draft-types";
import { PresetDetail } from "../../_components/preset-detail";

export default async function PresetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAuth();
  const { slug } = await params;
  const preset = await getCharacterPreset(slug);
  if (!preset) notFound();

  const payload = preset.payload as unknown as CharacterDraft;

  return (
    <PresetDetail
      presetId={preset.id}
      presetName={preset.name}
      archetype={preset.archetype}
      draft={payload}
    />
  );
}
