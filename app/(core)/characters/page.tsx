import Link from "next/link";
import { requireAuth } from "@/lib/auth/can";
import { listCharactersForUser } from "@/lib/characters/access";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateCharacterDialog } from "./_components/create-character-dialog";
import { DeleteCharacterButton } from "./_components/delete-character-button";
import { format } from "date-fns";

export default async function CharactersPage() {
  const session = await requireAuth();
  const characters = await listCharactersForUser(session.user.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Characters</h1>
          <p className="text-sm text-muted-foreground">
            Your adventuring party. Pick one to open its tools.
          </p>
        </div>
        <CreateCharacterDialog />
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
          {characters.map((c) => (
            <Card key={c.id}>
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
                <CardAction>
                  <DeleteCharacterButton characterId={c.id} name={c.name} />
                </CardAction>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                Updated {format(c.updatedAt, "MMM d, yyyy")}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
