import { prisma } from "@/lib/prisma";
import { requireCharacter } from "@/lib/characters/access";
import { Card, CardContent } from "@/components/ui/card";
import { NoteEditor } from "./_components/note-editor";
import { NewNoteDialog } from "./_components/new-note-dialog";
import { HandoutCard } from "./_components/handout-card";

export default async function NotesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await requireCharacter(id);

  const [notes, handouts] = await Promise.all([
    prisma.note.findMany({
      where: { characterId: id },
      orderBy: [{ pinned: "desc" }, { updatedAt: "desc" }],
    }),
    prisma.handoutRecipient.findMany({
      where: {
        userId,
        handout: {
          campaign: {
            memberships: {
              some: { userId, characterId: id },
            },
          },
        },
      },
      include: {
        handout: {
          include: {
            campaign: { select: { name: true } },
            author: { select: { name: true } },
          },
        },
      },
      orderBy: [
        { pinned: "desc" },
        { handout: { createdAt: "desc" } },
      ],
    }),
  ]);

  const hasAnything = notes.length > 0 || handouts.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Notes & Journal</h2>
        <NewNoteDialog characterId={id} />
      </div>

      {handouts.length > 0 && (
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            From the DM
          </h3>
          {handouts.map((r) => (
            <HandoutCard
              key={r.id}
              handoutId={r.handoutId}
              title={r.handout.title}
              body={r.handout.body}
              createdAt={r.handout.createdAt}
              authorName={r.handout.author.name}
              campaignName={r.handout.campaign.name}
              pinned={r.pinned}
              wasUnread={r.readAt === null}
            />
          ))}
        </div>
      )}

      {notes.length > 0 && (
        <div className="flex flex-col gap-3">
          {handouts.length > 0 && (
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Your notes
            </h3>
          )}
          {notes.map((n) => (
            <NoteEditor key={n.id} characterId={id} note={n} />
          ))}
        </div>
      )}

      {!hasAnything && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No notes yet. Keep track of lore, NPCs, or session recaps.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
