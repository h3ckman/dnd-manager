"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ALIGNMENTS, CLASSES, RACES, defaultAbilities } from "@/lib/dnd";
import type { CharacterDraft } from "@/lib/characters/draft-types";
import { buildBlankDraft } from "@/lib/characters/draft-builders";

const STORAGE_KEY = "character-draft-v1";

function makeInitialDraft(): CharacterDraft {
  return buildBlankDraft({
    name: "",
    race: RACES[0].name,
    characterClass: CLASSES[0].name,
    background: "Folk Hero",
    alignment: ALIGNMENTS[4],
  });
}

type DraftContextValue = {
  draft: CharacterDraft;
  setDraft: (next: CharacterDraft) => void;
  patchIdentity: (patch: Partial<CharacterDraft["identity"]>) => void;
  setAbilities: (abilities: CharacterDraft["abilities"]) => void;
  setSkills: (skills: readonly CharacterDraft["skillProficiencies"][number][]) => void;
  setInventory: (inventory: CharacterDraft["inventory"]) => void;
  setSpells: (spells: CharacterDraft["spells"]) => void;
  setFeatures: (features: CharacterDraft["features"]) => void;
  reset: () => void;
  hydrated: boolean;
};

const DraftContext = createContext<DraftContextValue | null>(null);

export function DraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraftState] = useState<CharacterDraft>(makeInitialDraft);
  const [hydrated, setHydrated] = useState(false);
  const skipPersistRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    let restored: CharacterDraft | null = null;
    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CharacterDraft;
        if (parsed && parsed.identity && parsed.abilities) {
          restored = {
            identity: parsed.identity,
            abilities: parsed.abilities ?? defaultAbilities(),
            skillProficiencies: parsed.skillProficiencies ?? [],
            inventory: parsed.inventory ?? [],
            spells: parsed.spells ?? [],
            features: parsed.features ?? [],
          };
        }
      }
    } catch {
      // ignore corrupt storage
    }
    if (restored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot rehydration from sessionStorage
      setDraftState(restored);
    }
    skipPersistRef.current = false;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (skipPersistRef.current) return;
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch {
      // ignore quota errors
    }
  }, [draft]);

  const setDraft = useCallback((next: CharacterDraft) => setDraftState(next), []);

  const patchIdentity = useCallback(
    (patch: Partial<CharacterDraft["identity"]>) => {
      setDraftState((prev) => ({
        ...prev,
        identity: { ...prev.identity, ...patch },
      }));
    },
    [],
  );

  const setAbilities = useCallback((abilities: CharacterDraft["abilities"]) => {
    setDraftState((prev) => ({ ...prev, abilities }));
  }, []);

  const setSkills = useCallback(
    (skills: readonly CharacterDraft["skillProficiencies"][number][]) => {
      setDraftState((prev) => ({ ...prev, skillProficiencies: [...skills] }));
    },
    [],
  );

  const setInventory = useCallback((inventory: CharacterDraft["inventory"]) => {
    setDraftState((prev) => ({ ...prev, inventory }));
  }, []);

  const setSpells = useCallback((spells: CharacterDraft["spells"]) => {
    setDraftState((prev) => ({ ...prev, spells }));
  }, []);

  const setFeatures = useCallback((features: CharacterDraft["features"]) => {
    setDraftState((prev) => ({ ...prev, features }));
  }, []);

  const reset = useCallback(() => {
    skipPersistRef.current = true;
    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
    setDraftState(makeInitialDraft());
    skipPersistRef.current = false;
  }, []);

  const value = useMemo<DraftContextValue>(
    () => ({
      draft,
      setDraft,
      patchIdentity,
      setAbilities,
      setSkills,
      setInventory,
      setSpells,
      setFeatures,
      reset,
      hydrated,
    }),
    [
      draft,
      setDraft,
      patchIdentity,
      setAbilities,
      setSkills,
      setInventory,
      setSpells,
      setFeatures,
      reset,
      hydrated,
    ],
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error("useDraft must be used inside <DraftProvider>");
  return ctx;
}
