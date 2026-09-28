export default function AdminLoading() {
  return (
    <div className="space-y-5" aria-busy="true">
      <div className="h-8 w-48 animate-pulse rounded bg-secondary" />
      <div className="h-4 w-72 max-w-full animate-pulse rounded bg-secondary" />
      <div className="overflow-hidden rounded-2xl border border-border/70 bg-card">
        <div className="h-12 animate-pulse bg-secondary/80" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-4 border-t border-border/60 px-4 py-4">
            <div className="h-4 w-1/4 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-secondary" />
            <div className="ml-auto h-4 w-16 animate-pulse rounded bg-secondary" />
          </div>
        ))}
      </div>
    </div>
  );
}
