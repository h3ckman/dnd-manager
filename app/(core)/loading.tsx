import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col flex-1 font-sans">
      <main className="flex flex-1 w-full flex-col gap-8">
        <div className="w-full space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-56" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="h-px w-full bg-muted" />
        </div>
      </main>
    </div>
  );
}
