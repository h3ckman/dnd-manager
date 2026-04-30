import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import {
  GoogleOAuthError,
  buildAuthorizeUrl,
} from "@/lib/auth/oauth/google";
import { generateState, setStateCookie } from "@/lib/auth/oauth/state";

export async function GET(request: Request) {
  const session = await getSession();
  if (session?.user.emailVerified) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const redirectUri = process.env.GOOGLE_REDIRECT_URI;
  if (!redirectUri) {
    return NextResponse.redirect(
      new URL("/login?error=oauth_misconfigured", request.url),
    );
  }

  try {
    const state = generateState();
    await setStateCookie(state);
    const authorizeUrl = buildAuthorizeUrl({ state, redirectUri });
    return NextResponse.redirect(authorizeUrl);
  } catch (err) {
    if (err instanceof GoogleOAuthError) {
      return NextResponse.redirect(
        new URL("/login?error=oauth_misconfigured", request.url),
      );
    }
    throw err;
  }
}
