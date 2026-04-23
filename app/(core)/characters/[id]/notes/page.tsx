import { prisma } from "@/lib/prisma";
import { requireCharacter } from "@/lib/characters/access";
import { Card, CardContent } from "@/components/ui/card";
import { NoteEditor } from "./_components/note-editor";
import { NewNoteDialog } from "./_components/new-note-dialog";

export default async function NotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireCharacter(id);

  const notes = await prisma.note.findMany({
    where: { characterId: id },
    orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notes & Journal</h2>
        <NewNoteDialog characterId={id} />
      </div>

      {notes.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No notes yet. Keep track of lore, NPCs, or session recaps.
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {notes.map((n) => (
            <NoteEditor key={n.id} characterId={id} note={n} />
          ))}
        </div>
      )}
    </div>
  );
}
