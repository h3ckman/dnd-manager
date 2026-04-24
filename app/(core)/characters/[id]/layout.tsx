import { requireCharacter } from "@/lib/characters/access";
import { TabBar } from "@/app/(core)/_components/tab-bar";

export default async function CharacterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { character } = await requireCharacter(id);

  const tabs = [
    { href: `/characters/${id}/sheet`, label: "Sheet" },
    { href: `/characters/${id}/inventory`, label: "Inventory" },
    { href: `/characters/${id}/spells`, label: "Spells" },
    { href: `/characters/${id}/features`, label: "Features" },
    { href: `/characters/${id}/notes`, label: "Notes" },
  ];

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

      <TabBar tabs={tabs} />

      {children}
    </div>
  );
}
