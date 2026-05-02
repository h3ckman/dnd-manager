import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import dndLogo from "@/public/dnd_logo.png";
import { Ornament } from "./_components/ornament";

const delay = (ms: number): CSSProperties =>
  ({ "--arcane-delay": `${ms}ms` }) as CSSProperties;

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="theme-arcane font-body relative isolate flex min-h-screen w-full overflow-hidden">

      {/* Atmospheric backdrop layers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 12% 8%, oklch(0.55 0.18 55 / 0.22), transparent 55%), radial-gradient(ellipse at 88% 92%, oklch(0.42 0.16 35 / 0.28), transparent 60%), linear-gradient(180deg, oklch(0.18 0.014 60), oklch(0.13 0.01 60))",
        }}
      />
      <div
        aria-hidden="true"
        className="bg-grain pointer-events-none absolute inset-0 -z-10 opacity-[0.07] mix-blend-overlay"
      />

      {/* Hero pane (desktop) */}
      <aside className="relative hidden flex-[1.1] items-center justify-center overflow-hidden md:flex">
        <div
          aria-hidden="true"
          className="absolute inset-y-12 right-0 w-px bg-gradient-to-b from-transparent via-[oklch(0.78_0.13_78/0.35)] to-transparent"
        />
        <div className="relative flex max-w-md flex-col items-center px-12 text-center">
          <div
            data-arcane-rise
            data-arcane-glow
            style={delay(60)}
            className="relative"
          >
            <Image
              src={dndLogo}
              alt="Dungeons & Dragons emblem"
              priority
              sizes="(min-width: 1280px) 420px, (min-width: 768px) 360px, 0px"
              className="h-auto w-[clamp(280px,30vw,420px)] select-none"
            />
          </div>
          <h1
            data-arcane-rise
            style={delay(260)}
            className="font-display mt-10 text-[1.05rem] font-semibold uppercase leading-tight tracking-[0.42em] text-[oklch(0.86_0.09_78)]"
          >
            Dungeons{" "}
            <span className="text-[oklch(0.78_0.13_78)]">&amp;</span> Dragons
            <span className="mt-1 block text-[0.78rem] tracking-[0.55em] text-[oklch(0.7_0.08_75)]">
              Campaign Manager
            </span>
          </h1>
          <span data-arcane-rise style={delay(360)} className="mt-6 block">
            <Ornament className="h-3 w-44 text-[oklch(0.78_0.13_78/0.55)]" />
          </span>
          <p
            data-arcane-rise
            style={delay(440)}
            className="mt-5 max-w-xs text-base italic leading-relaxed text-[oklch(0.78_0.04_75)]"
          >
            &ldquo;Roll for initiative — your party awaits beyond the
            threshold.&rdquo;
          </p>
        </div>
      </aside>

      {/* Form pane */}
      <main className="relative flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10 md:py-14">
        {/* Mobile logo (hidden once the hero pane appears) */}
        <div
          data-arcane-rise
          data-arcane-glow
          style={delay(60)}
          className="mb-7 flex flex-col items-center md:hidden"
        >
          <Image
            src={dndLogo}
            alt="Dungeons & Dragons emblem"
            priority
            sizes="(max-width: 767px) 180px, 0px"
            className="h-auto w-[160px] select-none sm:w-[180px]"
          />
          <span className="font-display mt-3 text-[0.66rem] uppercase tracking-[0.5em] text-[oklch(0.78_0.06_75)]">
            Campaign Manager
          </span>
        </div>
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
