import { prisma } from "@/lib/prisma";
import { requireCharacter } from "@/lib/characters/access";
import { AddFeatureDialog } from "./_components/add-feature-dialog";
import { FeatureList } from "./_components/feature-list";

export default async function FeaturesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireCharacter(id);

  const features = await prisma.feature.findMany({
    where: { characterId: id },
    orderBy: [{ source: "asc" }, { name: "asc" }],
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Features & Traits</h2>
          <p className="text-xs text-muted-foreground">
            Class features, racial traits, feats, and other abilities.
          </p>
        </div>
        <AddFeatureDialog characterId={id} />
      </div>
      <FeatureList characterId={id} features={features} />
    </div>
  );
}
