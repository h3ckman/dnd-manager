import { requireAuth } from "@/lib/auth/can";
import { listPresetPortraits } from "@/lib/characters/portraits";
import { DraftProvider } from "./_components/wizard-context";
import { PresetPortraitsContext } from "./_components/portrait-presets-context";

export default async function StandardWizardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const presets = await listPresetPortraits();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Standard creation</h1>
        <p className="text-sm text-muted-foreground">
          A guided walkthrough. Your progress is kept locally in this browser
          tab — feel free to refresh.
        </p>
      </div>
      <DraftProvider>
        <PresetPortraitsContext value={presets}>
          {children}
        </PresetPortraitsContext>
      </DraftProvider>
    </div>
  );
}
