"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDraft } from "./wizard-context";
import {
  ALL_STEPS,
  type StepSlug,
  nextStep,
  prevStep,
  visibleSteps,
} from "./wizard-steps";

export function WizardShell({
  step,
  children,
  onNext,
  nextDisabled,
  onSubmit,
  submitting,
}: {
  step: StepSlug;
  children: React.ReactNode;
  onNext?: () => boolean | void;
  nextDisabled?: boolean;
  onSubmit?: () => void;
  submitting?: boolean;
}) {
  const router = useRouter();
  const { draft, hydrated } = useDraft();

  const steps = visibleSteps(draft);
  const stepIndex = steps.findIndex((s) => s.slug === step);

  function goNext() {
    if (onNext) {
      const proceed = onNext();
      if (proceed === false) return;
    }
    const next = nextStep(step, draft);
    if (next) router.push(`/characters/new/standard/${next}`);
  }

  function goPrev() {
    const prev = prevStep(step, draft);
    if (prev) router.push(`/characters/new/standard/${prev}`);
    else router.push("/characters/new");
  }

  const isReview = step === "review";

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex flex-wrap items-center gap-2 text-xs">
        {ALL_STEPS.map((s, i) => {
          const visible = steps.some((v) => v.slug === s.slug);
          const isCurrent = s.slug === step;
          const visibleIndex = steps.findIndex((v) => v.slug === s.slug);
          const isPast = visibleIndex >= 0 && visibleIndex < stepIndex;
          return (
            <li
              key={s.slug}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1",
                !visible && "opacity-30",
                isCurrent && "bg-primary text-primary-foreground",
                !isCurrent && isPast && "bg-muted text-foreground",
                !isCurrent && !isPast && "bg-muted/50 text-muted-foreground",
              )}
            >
              <span className="font-medium">
                {i + 1}. {s.label}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="rounded-xl border bg-card p-6">
        {hydrated ? children : (
          <div className="text-sm text-muted-foreground">Loading…</div>
        )}
      </div>

      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={goPrev}>
          {stepIndex === 0 ? "Cancel" : "Back"}
        </Button>
        {isReview ? (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? "Creating…" : "Create character"}
          </Button>
        ) : (
          <Button type="button" onClick={goNext} disabled={nextDisabled}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
