"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginAction, type LoginState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Ornament } from "../../_components/ornament";

const initialState: LoginState = { error: null };

const ERROR_MESSAGES: Record<string, string> = {
  oauth_state: "Sign-in was interrupted. Please try again.",
  oauth_misconfigured: "Google sign-in is not configured.",
  oauth_failed: "Google sign-in failed. Please try again.",
  oauth_unverified: "Google says that email isn't verified.",
  account_disabled: "That account has been disabled.",
};

const delay = (ms: number): CSSProperties =>
  ({ "--arcane-delay": `${ms}ms` }) as CSSProperties;

export function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "";
  const errorCode = params.get("error");
  const [state, formAction, pending] = useActionState(
    loginAction,
    initialState,
  );

  useEffect(() => {
    if (state.error) toast.error(state.error);
  }, [state]);

  useEffect(() => {
    if (errorCode) {
      toast.error(ERROR_MESSAGES[errorCode] ?? "Something went wrong.");
    }
  }, [errorCode]);

  return (
    <div
      data-arcane-rise
      style={delay(520)}
      className="relative rounded-2xl border border-[oklch(0.78_0.13_78/0.28)] bg-card/85 px-7 py-9 shadow-[0_30px_80px_-30px_oklch(0_0_0/0.7),inset_0_1px_0_oklch(0.78_0.13_78/0.18)] backdrop-blur-sm sm:px-9 sm:py-10"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-[3px] rounded-[14px] border border-[oklch(0.78_0.13_78/0.12)]"
      />

      <header className="relative flex flex-col items-center text-center">
        <Ornament
          variant="diamond"
          className="size-3.5 text-[oklch(0.78_0.13_78)]"
        />
        <h2 className="font-display mt-3 text-2xl font-semibold uppercase tracking-[0.32em] text-foreground">
          Sign In
        </h2>
        <p className="mt-2 max-w-[28ch] text-[0.95rem] italic leading-snug text-muted-foreground">
          Speak the words and the wards will part.
        </p>
      </header>

      <form action={formAction} className="relative mt-7 flex flex-col gap-5">
        <input type="hidden" name="next" value={next} />

        <div
          data-arcane-rise
          style={delay(640)}
          className="flex flex-col gap-2"
        >
          <Label
            htmlFor="email"
            className="font-display text-[0.7rem] uppercase tracking-[0.28em] text-[oklch(0.82_0.06_78)]"
          >
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            autoFocus
            className="h-11 border-[oklch(0.78_0.13_78/0.3)] bg-[oklch(0.18_0.018_60)] text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:border-[oklch(0.78_0.13_78/0.6)]"
          />
        </div>

        <div
          data-arcane-rise
          style={delay(720)}
          className="flex flex-col gap-2"
        >
          <Label
            htmlFor="password"
            className="font-display text-[0.7rem] uppercase tracking-[0.28em] text-[oklch(0.82_0.06_78)]"
          >
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="h-11 border-[oklch(0.78_0.13_78/0.3)] bg-[oklch(0.18_0.018_60)] text-base text-foreground placeholder:text-muted-foreground/60 focus-visible:border-[oklch(0.78_0.13_78/0.6)]"
          />
        </div>

        {state.error && (
          <p
            className="text-sm text-destructive"
            role="alert"
            data-arcane-rise
            style={delay(740)}
          >
            {state.error}
          </p>
        )}

        <Button
          type="submit"
          disabled={pending}
          data-arcane-rise
          style={delay(800)}
          className="font-display group/sigil relative mt-1 h-12 overflow-hidden text-[0.78rem] uppercase tracking-[0.36em] text-primary-foreground shadow-[0_8px_22px_-10px_oklch(0.55_0.18_55/0.7)]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(135deg,oklch(0.84_0.13_82)_0%,oklch(0.7_0.16_60)_50%,oklch(0.84_0.13_82)_100%)]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(115deg,transparent_30%,oklch(1_0_0/0.55)_50%,transparent_70%)] bg-[length:240%_100%] opacity-0 transition-opacity duration-300 group-hover/sigil:animate-[arcane-shimmer_1.8s_ease-in-out_1] group-hover/sigil:opacity-100"
          />
          <span className="relative">
            {pending ? "Casting…" : "Enter the realm"}
          </span>
        </Button>
      </form>

      <div
        data-arcane-rise
        style={delay(880)}
        className="relative mt-7 flex items-center gap-3 text-muted-foreground"
        role="separator"
        aria-orientation="horizontal"
      >
        <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[oklch(0.78_0.13_78/0.4)]" />
        <Ornament
          variant="diamond"
          className="size-2.5 text-[oklch(0.78_0.13_78)]"
        />
        <span className="font-display text-[0.62rem] uppercase tracking-[0.45em] text-[oklch(0.78_0.06_75)]">
          or
        </span>
        <Ornament
          variant="diamond"
          className="size-2.5 text-[oklch(0.78_0.13_78)]"
        />
        <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[oklch(0.78_0.13_78/0.4)]" />
      </div>

      <Button
        variant="outline"
        render={<a href="/api/auth/google/start" />}
        nativeButton={false}
        data-arcane-rise
        style={delay(940)}
        className="mt-5 h-11 w-full border-[oklch(0.78_0.13_78/0.35)] bg-transparent text-[0.85rem] tracking-wide text-foreground hover:border-[oklch(0.78_0.13_78/0.6)] hover:bg-[oklch(0.78_0.13_78/0.06)]"
      >
        Continue with Google
      </Button>

      <p
        data-arcane-rise
        style={delay(1000)}
        className="mt-6 text-center text-sm italic text-muted-foreground"
      >
        New traveler?{" "}
        <Link
          href="/register"
          className="font-medium not-italic text-[oklch(0.84_0.11_78)] underline decoration-[oklch(0.78_0.13_78/0.45)] underline-offset-4 transition-colors hover:text-[oklch(0.92_0.12_82)] hover:decoration-[oklch(0.78_0.13_78/0.85)]"
        >
          Create an account
        </Link>
        .
      </p>
    </div>
  );
}
