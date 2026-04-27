import Link from "next/link";
import Image from "next/image";
import { PlusIcon } from "lucide-react";
import { requireAuth } from "@/lib/auth/can";
import { listCharactersForUser } from "@/lib/characters/access";
import { readActiveCharacterId } from "@/lib/characters/active";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteCharacterButton } from "./_components/delete-character-button";
import { format } from "date-fns";

export default async function CharactersPage() {
  const session = await requireAuth();
  const [characters, activeId] = await Promise.all([
    listCharactersForUser(session.user.id),
    readActiveCharacterId(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Characters</h1>
          <p className="text-sm text-muted-foreground">
            Your adventuring party. Pick one to open its tools.
          </p>
        </div>
        <Button nativeButton={false} render={<Link href="/characters/new" />}>
          <PlusIcon className="size-4" />
          New character
        </Button>
      </div>

      {characters.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              You haven&apos;t created any characters yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {characters.map((c) => {
            const isActive = c.id === activeId;
            return (
              <Card key={c.id} className="relative pt-0">
                <div className="absolute inset-x-0 top-0 z-30 aspect-video bg-black/35" />
                <PortraitBanner
                  src={c.portraitUrl}
                  alt={c.name}
                  fallbackText={c.name}
                />
                <CardHeader>
                  <CardTitle>
                    <Link
                      href={`/characters/${c.id}/sheet`}
                      className="hover:underline"
                    >
                      {c.name}
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    Level {c.level} {c.race} {c.characterClass}
                  </CardDescription>
                  <CardAction className="flex items-center gap-2">
                    {isActive && <Badge variant="secondary">Active</Badge>}
                    <DeleteCharacterButton
                      characterId={c.id}
                      name={c.name}
                    />
                  </CardAction>
                </CardHeader>
                <CardContent className="text-xs text-muted-foreground">
                  Updated {format(c.updatedAt, "MMM d, yyyy")}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function PortraitBanner({
  src,
  alt,
  fallbackText,
}: {
  src: string | null;
  alt: string;
  fallbackText: string;
}) {
  if (!src) {
    return (
      <div className="relative z-20 flex aspect-video w-full items-center justify-center bg-muted brightness-60 grayscale dark:brightness-40">
        <span className="text-5xl font-bold uppercase text-muted-foreground">
          {fallbackText.slice(0, 1)}
        </span>
      </div>
    );
  }
  if (src.startsWith("data:")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={600}
      height={338}
      className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
    />
  );
}
