import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listCharacterPresets } from "@/lib/characters/presets";

const ARCHETYPE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "destructive"
> = {
  melee: "destructive",
  caster: "default",
  support: "secondary",
  skirmisher: "outline",
};

export async function PresetGallery({
  filterClass,
}: {
  filterClass?: string;
}) {
  const presets = await listCharacterPresets(filterClass);

  if (presets.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No presets match this filter.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {presets.map((p) => (
        <Link
          key={p.id}
          href={`/characters/new/premade/${p.slug}`}
          className="block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <Card className="h-full transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{p.name}</CardTitle>
                <Badge
                  variant={ARCHETYPE_VARIANT[p.archetype] ?? "outline"}
                  className="capitalize"
                >
                  {p.archetype}
                </Badge>
              </div>
              <CardDescription>
                Level 1 {p.race}
                {p.subrace ? ` (${p.subrace})` : ""} {p.characterClass}
                {p.subclass ? ` — ${p.subclass}` : ""}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {p.summary}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
