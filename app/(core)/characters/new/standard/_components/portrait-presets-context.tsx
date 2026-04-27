"use client";

import { createContext, useContext } from "react";
import type { PresetPortrait } from "@/lib/characters/portraits";

const Ctx = createContext<readonly PresetPortrait[]>([]);

export function PresetPortraitsContext({
  value,
  children,
}: {
  value: readonly PresetPortrait[];
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePresetPortraits(): readonly PresetPortrait[] {
  return useContext(Ctx);
}
