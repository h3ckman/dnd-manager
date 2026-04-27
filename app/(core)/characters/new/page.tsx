import Link from "next/link";
import {
  FileTextIcon,
  PencilIcon,
  SparklesIcon,
  UsersIcon,
} from "lucide-react";
import { requireAuth } from "@/lib/auth/can";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const MODES = [
  {
    href: "/characters/new/blank",
    icon: FileTextIcon,
    title: "Blank",
    description:
      "An empty level-1 sheet you can fill in piece by piece. Best when you already know what you want.",
  },
  {
    href: "/characters/new/standard",
    icon: PencilIcon,
    title: "Standard",
    description:
      "A guided walkthrough for every important choice — abilities, skills, equipment, and spells.",
  },
  {
    href: "/characters/new/quick",
    icon: SparklesIcon,
    title: "Quick",
    description:
      "Pick a class and we'll fill in sensible defaults so you can get to the table fast.",
  },
  {
    href: "/characters/new/premade",
    icon: UsersIcon,
    title: "Pre-Made",
    description:
      "Choose from curated builds — melee, caster, support — ready to play.",
  },
] as const;

export default async function NewCharacterModePicker() {
  await requireAuth();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add a character</h1>
        <p className="text-sm text-muted-foreground">
          Pick a starting point. You can adjust everything later from the
          character sheet.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          return (
            <Link
              key={mode.href}
              href={mode.href}
              className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <CardTitle className="mt-2 text-lg">{mode.title}</CardTitle>
                  <CardDescription>{mode.description}</CardDescription>
                </CardHeader>
                <CardContent />
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
