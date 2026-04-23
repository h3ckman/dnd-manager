import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 font-sans">
      <main className="flex flex-1 w-full flex-col gap-8">
        <div className="w-full space-y-6">
          <div className="flex items-center gap-4">
            <Image
              className="dark:invert"
              src="/logo.png"
              alt="Logo"
              width={220}
              height={40}
              priority
            />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">Welcome</h1>
            <p className="text-sm text-muted-foreground">
              This is a starting template. Replace this page with your
              application&apos;s home screen.
            </p>
          </div>
          <div className="h-px w-full bg-muted" />
        </div>
      </main>
    </div>
  );
}
