"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { loginAction, type LoginState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialState: LoginState = { error: null };

const ERROR_MESSAGES: Record<string, string> = {
  oauth_state: "Sign-in was interrupted. Please try again.",
  oauth_misconfigured: "Google sign-in is not configured.",
  oauth_failed: "Google sign-in failed. Please try again.",
  oauth_unverified: "Google says that email isn't verified.",
  account_disabled: "That account has been disabled.",
};

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
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to continue.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <form action={formAction} className="flex flex-col gap-4">
          <input type="hidden" name="next" value={next} />
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              autoFocus
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>
          {state.error && (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          )}
          <Button type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </Button>
        </form>
        <div className="relative text-center text-xs text-muted-foreground">
          <span className="bg-card relative z-10 px-2">or</span>
          <span className="bg-border absolute inset-x-0 top-1/2 -z-0 h-px" />
        </div>
        <Button
          variant="outline"
          render={<a href="/api/auth/google/start" />}
          nativeButton={false}
        >
          Continue with Google
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="underline">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
