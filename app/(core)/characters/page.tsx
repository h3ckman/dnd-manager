import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { requireAuth } from "@/lib/auth/can";
import { listCharactersForUser } from "@/lib/characters/access";
import { readActiveCharacterId } from "@/lib/characters/active";
import { Card, CardContent } from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import { Button } from "@/components/ui/button";
import { CharacterItem } from "@/components/character-item";

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
            Your adventurers. Pick one to open its tools.
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
        <ItemGroup className="grid grid-cols-1 gap-2 xl:grid-cols-2">
          {characters.map((c) => (
            <CharacterItem
              key={c.id}
              character={c}
              href={`/characters/${c.id}/sheet`}
              isActive={c.id === activeId}
            />
          ))}
        </ItemGroup>
      )}
    </div>
  );
}
