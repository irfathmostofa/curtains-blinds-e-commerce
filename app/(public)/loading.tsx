export default function Loading() {
  return (
    <main className="container py-20">
      <div className="h-10 w-64 animate-pulse rounded bg-secondary" />
      <div className="mt-6 h-4 w-full max-w-xl animate-pulse rounded bg-secondary" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-secondary" />
        ))}
      </div>
    </main>
  );
}
