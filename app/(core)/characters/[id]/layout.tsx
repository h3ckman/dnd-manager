import { requireCharacter } from "@/lib/characters/access";
import { listPresetPortraits } from "@/lib/characters/portraits";
import { TabBar } from "@/app/(core)/_components/tab-bar";
import { Portrait } from "@/app/(core)/_components/portrait";
import { PortraitEditorDialog } from "./_components/portrait-editor-dialog";

export default async function CharacterLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { character } = await requireCharacter(id);
  const presets = await listPresetPortraits();

  const tabs = [
    { href: `/characters/${id}/sheet`, label: "Sheet" },
    { href: `/characters/${id}/inventory`, label: "Inventory" },
    { href: `/characters/${id}/spells`, label: "Spells" },
    { href: `/characters/${id}/features`, label: "Features" },
    { href: `/characters/${id}/notes`, label: "Notes" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center gap-4">
        <div className="relative">
          <Portrait
            src={character.portraitUrl}
            alt={character.name}
            size={72}
            rounded="lg"
            fallbackText={character.name}
          />
          <PortraitEditorDialog
            characterId={id}
            currentPortraitUrl={character.portraitUrl}
            presets={presets}
          />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-baseline gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {character.name}
            </h1>
            <span className="text-sm text-muted-foreground">
              Level {character.level} {character.race}{" "}
              {character.characterClass}
              {character.subclass ? ` (${character.subclass})` : ""}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {character.background} · {character.alignment}
          </p>
        </div>
      </header>

      <TabBar tabs={tabs} />

      {children}
    </div>
  );
}
