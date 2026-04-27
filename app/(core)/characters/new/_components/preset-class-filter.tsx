"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { CLASSES } from "@/lib/dnd";
import { Label } from "@/components/ui/label";

export function PresetClassFilter() {
  const router = useRouter();
  const params = useSearchParams();
  const value = params.get("class") ?? "";

  function onChange(v: string) {
    const next = new URLSearchParams(params.toString());
    if (v) next.set("class", v);
    else next.delete("class");
    router.replace(`/characters/new/premade${next.toString() ? `?${next}` : ""}`);
  }

  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="preset-class-filter" className="text-sm">
        Filter by class
      </Label>
      <select
        id="preset-class-filter"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border bg-background px-3 py-1.5 text-sm"
      >
        <option value="">All classes</option>
        {CLASSES.map((c) => (
          <option key={c.name} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
    </div>
  );
}
