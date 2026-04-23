import { prisma } from "@/lib/prisma";
import { requireCharacter } from "@/lib/characters/access";
import { CurrencyPanel } from "./_components/currency-panel";
import { AddItemDialog } from "./_components/add-item-dialog";
import { InventoryTable } from "./_components/inventory-table";
import { Card, CardContent } from "@/components/ui/card";

export default async function InventoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireCharacter(id);

  const [character, items] = await Promise.all([
    prisma.character.findUniqueOrThrow({ where: { id } }),
    prisma.inventoryItem.findMany({
      where: { characterId: id },
      orderBy: [{ equipped: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  const totalWeight = items.reduce(
    (sum, i) => sum + i.weight * i.quantity,
    0,
  );

  return (
    <div className="flex flex-col gap-4">
      <CurrencyPanel
        characterId={id}
        copper={character.copper}
        silver={character.silver}
        electrum={character.electrum}
        gold={character.gold}
        platinum={character.platinum}
      />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Items</h2>
          <p className="text-xs text-muted-foreground">
            {items.length} item{items.length === 1 ? "" : "s"} ·{" "}
            {totalWeight.toFixed(1)} lb total
          </p>
        </div>
        <AddItemDialog characterId={id} />
      </div>

      {items.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No items yet. Add your first piece of gear.
          </CardContent>
        </Card>
      ) : (
        <InventoryTable characterId={id} items={items} />
      )}
    </div>
  );
}
