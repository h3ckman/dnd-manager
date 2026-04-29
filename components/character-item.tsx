import type { ReactNode } from "react";
import Link from "next/link";
import {
  ChevronRightIcon,
  CoinsIcon,
  FootprintsIcon,
  HeartIcon,
  ShieldIcon,
  ZapIcon,
} from "lucide-react";
import { formatModifier } from "@/lib/dnd/abilities";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type CharacterItemData = {
  id: string;
  name: string;
  race: string;
  characterClass: string;
  level: number;
  portraitUrl: string | null;
  currentHp: number;
  maxHp: number;
  tempHp: number;
  armorClass: number;
  gold: number;
  speed: number;
  initiative: number;
  updatedAt?: Date;
};

type CharacterItemProps = {
  character?: CharacterItemData | null;
  fallbackName?: string;
  fallbackLabel?: string;
  header?: ReactNode;
  actions?: ReactNode;
  href?: string;
  isActive?: boolean;
};

export function CharacterItem({
  character,
  fallbackName,
  fallbackLabel = "No character assigned",
  header,
  actions,
  href,
  isActive,
}: CharacterItemProps) {
  const displayName = character?.name ?? fallbackName ?? "Unknown";
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  const body = (
    <>
      <ItemMedia className="self-center group-has-data-[slot=item-description]/item:self-center">
        <Avatar className="size-24">
          {character?.portraitUrl && (
            <AvatarImage src={character.portraitUrl} alt={character.name} />
          )}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </ItemMedia>
      <ItemContent>
        {header}
        <ItemTitle className="text-lg font-semibold">{displayName}</ItemTitle>
        {character ? (
          <>
            <ItemDescription>
              Level {character.level} {character.race}{" "}
              {character.characterClass}
            </ItemDescription>
            <div className="flex flex-wrap items-center gap-1.5">
              {isActive && (
                <Badge className="border-emerald-500/20 bg-emerald-500/8 text-emerald-700 dark:text-emerald-400">
                  Active
                </Badge>
              )}
              <Badge className="border-sky-500/20 bg-sky-500/8 text-sky-700 dark:text-sky-400">
                <ShieldIcon className="size-3" />
                AC
                <span className="tabular-nums">{character.armorClass}</span>
              </Badge>
              <Badge className="border-amber-500/20 bg-amber-500/8 text-amber-700 dark:text-amber-400">
                <CoinsIcon className="size-3" />
                Gold
                <span className="tabular-nums">{character.gold}</span>
              </Badge>
              <Badge className="border-rose-500/20 bg-rose-500/8 text-rose-700 dark:text-rose-400">
                <ZapIcon className="size-3" />
                Init
                <span className="tabular-nums">
                  {formatModifier(character.initiative)}
                </span>
              </Badge>
              <Badge className="border-violet-500/20 bg-violet-500/8 text-violet-700 dark:text-violet-400">
                <FootprintsIcon className="size-3" />
                Spd
                <span className="tabular-nums">{character.speed}ft</span>
              </Badge>
            </div>
            <HpBar
              current={character.currentHp}
              max={character.maxHp}
              temp={character.tempHp}
            />
            {character.updatedAt && (
              <p className="text-xs text-muted-foreground">
                Updated {format(character.updatedAt, "MMM d, yyyy")}
              </p>
            )}
          </>
        ) : (
          <ItemDescription>{fallbackLabel}</ItemDescription>
        )}
      </ItemContent>
      {(href || actions) && (
        <ItemActions>
          {actions ?? <ChevronRightIcon className="size-4" />}
        </ItemActions>
      )}
    </>
  );

  if (href) {
    return (
      <Item
        variant="outline"
        role="listitem"
        render={<Link href={href}>{body}</Link>}
      />
    );
  }

  return (
    <Item variant="outline" role="listitem">
      {body}
    </Item>
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
