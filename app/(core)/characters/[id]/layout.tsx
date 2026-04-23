import Link from "next/link";
import { requireCharacter } from "@/lib/characters/access";
import { Card } from "@/components/ui/card";

const TABS = [
  { href: "sheet", label: "Sheet" },
  { href: "inventory", label: "Inventory" },
  { href: "spells", label: "Spells" },
  { href: "features", label: "Features" },
  { href: "notes", label: "Notes" },
] as const;

export default async function CharacterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { character } = await requireCharacter(id);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <div className="flex items-baseline gap-3">
          <h1 className="text-2xl font-bold tracking-tight">
            {character.name}
          </h1>
          <span className="text-sm text-muted-foreground">
            Level {character.level} {character.race} {character.characterClass}
            {character.subclass ? ` (${character.subclass})` : ""}
          </span>
        </div>
        <p className="text-xs text-muted-foreground">
          {character.background} · {character.alignment}
        </p>
      </header>

      <Card className="flex flex-row gap-1 p-1">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={`/characters/${id}/${t.href}`}
            className="flex-1 rounded-md px-3 py-1.5 text-center text-sm hover:bg-muted"
          >
            {t.label}
          </Link>
        ))}
      </Card>

      {children}
    </div>
  );
}
