export default function Loading() {
  return (
    <main className="container py-12 sm:py-16" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-2xl space-y-4 text-center">
        <div className="mx-auto h-3 w-24 animate-pulse rounded-full bg-accent/20" />
        <div className="mx-auto h-10 w-64 max-w-full animate-pulse rounded bg-secondary" />
        <div className="mx-auto h-4 w-full max-w-md animate-pulse rounded bg-secondary" />
      </div>
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border/70 bg-card">
            <div className="aspect-[4/5] animate-pulse bg-secondary" />
            <div className="space-y-3 p-4">
              <div className="h-4 w-2/3 animate-pulse rounded bg-secondary" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
