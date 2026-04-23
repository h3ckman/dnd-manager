import Link from "next/link";
import { requireAuth } from "@/lib/auth/can";
import { listCharactersForUser } from "@/lib/characters/access";
import { readActiveCharacterId } from "@/lib/characters/active";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DicesIcon,
  NotebookTextIcon,
  PackageIcon,
  ScrollTextIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";

export default async function Home() {
  const session = await requireAuth();
  const [characters, activeId] = await Promise.all([
    listCharactersForUser(session.user.id),
    readActiveCharacterId(),
  ]);
  const active =
    characters.find((c) => c.id === activeId) ?? characters[0] ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {session.user.name}
        </h1>
        <p className="text-sm text-muted-foreground">
          Pick a tool below or jump straight into your active character.
        </p>
      </div>

      {active ? (
        <Card>
          <CardHeader>
            <CardTitle>{active.name}</CardTitle>
            <CardDescription>
              Level {active.level} {active.race} {active.characterClass}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <LinkButton href={`/characters/${active.id}/sheet`} icon={<ScrollTextIcon />}>
              Sheet
            </LinkButton>
            <LinkButton href={`/characters/${active.id}/inventory`} icon={<PackageIcon />}>
              Inventory
            </LinkButton>
            <LinkButton href={`/characters/${active.id}/spells`} icon={<SparklesIcon />}>
              Spells
            </LinkButton>
            <LinkButton href={`/characters/${active.id}/notes`} icon={<NotebookTextIcon />}>
              Notes
            </LinkButton>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No active character</CardTitle>
            <CardDescription>
              Start by creating your first adventurer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LinkButton href="/characters" icon={<UsersIcon />}>
              Go to Characters
            </LinkButton>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <UsersIcon className="size-5" />
            <div className="flex-1">
              <div className="font-medium">Characters</div>
              <div className="text-xs text-muted-foreground">
                {characters.length} in your party
              </div>
            </div>
            <Link href="/characters" className="text-sm underline">
              Manage
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 py-4">
            <DicesIcon className="size-5" />
            <div className="flex-1">
              <div className="font-medium">Dice Roller</div>
              <div className="text-xs text-muted-foreground">
                Advantage, disadvantage, history
              </div>
            </div>
            <Link href="/dice" className="text-sm underline">
              Open
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LinkButton({
  href,
  icon,
  children,
}: {
  href: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Button variant="outline" render={<Link href={href} />}>
      {icon}
      {children}
    </Button>
  );
}
