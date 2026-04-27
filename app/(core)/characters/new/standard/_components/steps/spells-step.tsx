"use client";

import { Label } from "@/components/ui/label";
import { LEVEL1_SUGGESTED, SPELL_CATALOG } from "@/lib/dnd";
import { cn } from "@/lib/utils";
import { useDraft } from "../wizard-context";
import { WizardShell } from "../wizard-shell";

export function SpellsStep() {
  const { draft, setSpells } = useDraft();
  const className = draft.identity.characterClass;
  const suggestion = LEVEL1_SUGGESTED[className];

  if (!suggestion) {
    return (
      <WizardShell step="spells">
        <p className="text-sm text-muted-foreground">
          No suggested spells available for this class. You can add spells from
          the character sheet later.
        </p>
      </WizardShell>
    );
  }

  const cantripPicks = draft.spells.filter((s) => s.level === 0).map((s) => s.name);
  const spellPicks = draft.spells
    .filter((s) => (s.level ?? 0) > 0)
    .map((s) => s.name);

  function commitPicks(nextCantrips: string[], nextSpells: string[]) {
    const all = [
      ...nextCantrips.map((name) => {
        const c = SPELL_CATALOG.find((sp) => sp.name === name);
        return { name, level: c?.level ?? 0, prepared: true };
      }),
      ...nextSpells.map((name) => {
        const c = SPELL_CATALOG.find((sp) => sp.name === name);
        return { name, level: c?.level ?? 1, prepared: true };
      }),
    ];
    setSpells(all);
  }

  function toggleCantrip(name: string) {
    const has = cantripPicks.includes(name);
    if (has) {
      commitPicks(cantripPicks.filter((n) => n !== name), spellPicks);
    } else if (cantripPicks.length < suggestion.cantripCap) {
      commitPicks([...cantripPicks, name], spellPicks);
    }
  }

  function toggleSpell(name: string) {
    const has = spellPicks.includes(name);
    if (has) {
      commitPicks(cantripPicks, spellPicks.filter((n) => n !== name));
    } else if (spellPicks.length < suggestion.spellCap) {
      commitPicks(cantripPicks, [...spellPicks, name]);
    }
  }

  const cantripsLeft = suggestion.cantripCap - cantripPicks.length;
  const spellsLeft = suggestion.spellCap - spellPicks.length;
  const nextDisabled = cantripsLeft > 0 || spellsLeft > 0;

  return (
    <WizardShell step="spells" nextDisabled={nextDisabled}>
      <div className="flex flex-col gap-6">
        <div>
          <div className="flex items-center justify-between">
            <Label>Cantrips</Label>
            <span className={cn(
              "text-xs",
              cantripsLeft > 0 ? "text-destructive" : "text-muted-foreground",
            )}>
              Pick {suggestion.cantripCap} ({cantripsLeft > 0 ? `${cantripsLeft} left` : "done"})
            </span>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {suggestion.cantrips.map((name) => (
              <SpellChip
                key={name}
                name={name}
                selected={cantripPicks.includes(name)}
                disabled={
                  !cantripPicks.includes(name) &&
                  cantripPicks.length >= suggestion.cantripCap
                }
                onToggle={() => toggleCantrip(name)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label>Level-1 spells</Label>
            <span className={cn(
              "text-xs",
              spellsLeft > 0 ? "text-destructive" : "text-muted-foreground",
            )}>
              Pick {suggestion.spellCap} ({spellsLeft > 0 ? `${spellsLeft} left` : "done"})
            </span>
          </div>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {suggestion.spells.map((name) => (
              <SpellChip
                key={name}
                name={name}
                selected={spellPicks.includes(name)}
                disabled={
                  !spellPicks.includes(name) && spellPicks.length >= suggestion.spellCap
                }
                onToggle={() => toggleSpell(name)}
              />
            ))}
          </div>
        </div>
      </div>
    </WizardShell>
  );
}

function SpellChip({
  name,
  selected,
  disabled,
  onToggle,
}: {
  name: string;
  selected: boolean;
  disabled: boolean;
  onToggle: () => void;
}) {
  const catalog = SPELL_CATALOG.find((s) => s.name === name);
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      title={catalog?.description}
      className={cn(
        "flex flex-col gap-1 rounded-md border p-3 text-left transition-colors",
        selected ? "border-primary bg-primary/5" : "hover:bg-muted/50",
        disabled && "opacity-50",
      )}
    >
      <div className="text-sm font-medium">{name}</div>
      {catalog && (
        <div className="text-xs text-muted-foreground line-clamp-2">
          {catalog.description}
        </div>
      )}
    </button>
  );
}
