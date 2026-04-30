import { redirect } from "next/navigation";
import { Suspense } from "react";
import { VerifyEmailForm } from "./_components/verify-email-form";
import { getSession } from "@/lib/auth/session";

type Props = {
  searchParams: Promise<{ email?: string; unverified?: string }>;
};

export default async function VerifyEmailPage({ searchParams }: Props) {
  const session = await getSession();
  const params = await searchParams;
  if (session?.user.emailVerified) redirect("/");

  const email = params.email ?? session?.user.email ?? "";
  const unverified = params.unverified === "1";

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <Suspense>
        <VerifyEmailForm initialEmail={email} unverified={unverified} />
      </Suspense>
    </main>
  );
}
