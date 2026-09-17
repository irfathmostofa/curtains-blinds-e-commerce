import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container py-24 text-center">
      <h1 className="font-serif text-4xl">Page not found</h1>
      <p className="mt-3 text-muted-foreground">The page you requested is not in this collection.</p>
      <Link href="/" className="mt-6 inline-block underline">
        Back to home
      </Link>
    </main>
  );
}
