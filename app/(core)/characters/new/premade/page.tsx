import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { requireAuth } from "@/lib/auth/can";
import { PresetGallery } from "../_components/preset-gallery";
import { PresetClassFilter } from "../_components/preset-class-filter";

export default async function PremadePage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string }>;
}) {
  await requireAuth();
  const params = await searchParams;
  const filterClass = params.class || undefined;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pre-made characters</h1>
          <p className="text-sm text-muted-foreground">
            Curated builds — pick one and you&apos;re ready to play.
          </p>
        </div>
        <Button
          variant="outline"
          nativeButton={false}
          render={<Link href="/characters/new" />}
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>
      </div>

      <PresetClassFilter />

      <PresetGallery filterClass={filterClass} />
    </div>
  );
}
