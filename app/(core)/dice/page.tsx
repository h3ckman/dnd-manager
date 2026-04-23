import { DiceRoller } from "./_components/dice-roller";

export default function DicePage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dice Roller</h1>
        <p className="text-sm text-muted-foreground">
          Roll XdY+Z. Supports advantage and disadvantage on d20s.
        </p>
      </div>
      <DiceRoller />
    </div>
  );
}
