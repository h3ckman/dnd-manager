import Link from "next/link";
import Image from "next/image";
import {
  ChevronRightIcon,
  CoinsIcon,
  HeartIcon,
  PlusIcon,
  ShieldIcon,
} from "lucide-react";
import { requireAuth } from "@/lib/auth/can";
import { listCharactersForUser } from "@/lib/characters/access";
import { readActiveCharacterId } from "@/lib/characters/active";
import { Card, CardContent } from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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
          {characters.map((c) => {
            const isActive = c.id === activeId;
            return (
              <Item
                key={c.id}
                variant="outline"
                role="listitem"
                render={
                  <Link href={`/characters/${c.id}/sheet`}>
                    <ItemMedia
                      variant="image"
                      className="size-24 self-center group-has-data-[slot=item-description]/item:self-center"
                    >
                      <Portrait
                        src={c.portraitUrl}
                        alt={c.name}
                        fallbackText={c.name}
                      />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle className="text-lg font-semibold">
                        {c.name}
                      </ItemTitle>
                      <ItemDescription>
                        Level {c.level} {c.race} {c.characterClass}
                      </ItemDescription>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isActive && (
                          <Badge className="border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                            Active
                          </Badge>
                        )}
                        <Badge className="border-sky-500/40 bg-sky-500/15 text-sky-700 dark:text-sky-300">
                          <ShieldIcon className="size-3" />
                          Armor Class
                          <span className="tabular-nums">{c.armorClass}</span>
                        </Badge>
                        <Badge className="border-amber-500/40 bg-amber-500/15 text-amber-700 dark:text-amber-300">
                          <CoinsIcon className="size-3" />
                          Gold
                          <span className="tabular-nums">{c.gold}</span>
                        </Badge>
                      </div>
                      <HpBar
                        current={c.currentHp}
                        max={c.maxHp}
                        temp={c.tempHp}
                      />
                      <p className="text-xs text-muted-foreground">
                        Updated {format(c.updatedAt, "MMM d, yyyy")}
                      </p>
                    </ItemContent>
                    <ItemActions>
                      <ChevronRightIcon className="size-4" />
                    </ItemActions>
                  </Link>
                }
              />
            );
          })}
        </ItemGroup>
      )}
    </div>
  );
}

function HpBar({
  current,
  max,
  temp,
}: {
  current: number;
  max: number;
  temp: number;
}) {
  const pct = max > 0 ? Math.max(0, Math.min(100, (current / max) * 100)) : 0;
  const tone =
    pct > 50 ? "bg-emerald-500" : pct > 25 ? "bg-amber-500" : "bg-rose-500";
  return (
    <div className="flex items-center gap-2">
      <HeartIcon className="size-3.5 shrink-0 text-muted-foreground" />
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", tone)}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular-nums text-muted-foreground">
        {current}
        {temp > 0 && <span className="text-emerald-500"> +{temp}</span>}
        <span className="text-muted-foreground/60"> / {max}</span>
      </span>
    </div>
  );
}

function Portrait({
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
      <div className="flex size-full items-center justify-center bg-muted">
        <span className="text-sm font-bold uppercase text-muted-foreground">
          {fallbackText.slice(0, 1)}
        </span>
      </div>
    );
  }
  // if (src.startsWith("data:")) {
  //   return (
  //     // eslint-disable-next-line @next/next/no-img-element
  //     <img src={src} alt={alt} />
  //   );
  // }
  return <Image src={src} alt={alt} width={96} height={96} />;
}
