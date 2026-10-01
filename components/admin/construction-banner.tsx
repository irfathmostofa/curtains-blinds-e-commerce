import Link from "next/link";

export function ConstructionBanner() {
  return (
    <div className="border-b border-amber-300 bg-amber-100 px-4 py-2 text-center text-sm text-amber-950">
      Under construction is on. Visitors see a holding page.{" "}
      <Link href="/admin/settings" className="underline">
        Turn it off in settings
      </Link>
    </div>
  );
}
