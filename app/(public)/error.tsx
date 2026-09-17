"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container py-20">
      <h1 className="font-serif text-3xl">Something went wrong</h1>
      <p className="mt-3 text-muted-foreground">Please try again, or return home.</p>
      <button type="button" className="mt-6 underline" onClick={reset}>
        Retry
      </button>
    </main>
  );
}
