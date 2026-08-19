import Link from "next/link";

export function AppMark() {
  return (
    <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight" aria-label="CediApp home">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-lg font-black text-primary-foreground shadow-sm">₵</span>
      <span>Cedi<span className="text-primary">App</span></span>
    </Link>
  );
}
