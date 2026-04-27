import { requireAuth } from "@/lib/auth/can";
import { QuickForm } from "../_components/quick-form";

export default async function QuickCharacterPage() {
  await requireAuth();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Quick character</h1>
        <p className="text-sm text-muted-foreground">
          Pick a class and we&apos;ll fill in ability scores, skills, equipment,
          and starter spells with class-typical defaults.
        </p>
      </div>
      <QuickForm />
    </div>
  );
}
