import Link from "next/link";
import { AppMark } from "@/components/app-mark";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-border/70 bg-background/90 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5" aria-label="Main navigation">
        <AppMark />
        <div className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="#features" className="hover:text-foreground">Explore</Link>
          <Link href="#how-it-works" className="hover:text-foreground">How it works</Link>
          <Link href="#support" className="hover:text-foreground">Support</Link>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm"><Link href="/auth/login">Sign in</Link></Button>
          <Button asChild size="sm"><Link href="/auth/sign-up">Get started</Link></Button>
        </div>
      </nav>
      <details className="border-t px-5 py-3 text-sm md:hidden"><summary className="cursor-pointer font-medium">Menu</summary><div className="mt-3 flex flex-col gap-3 text-muted-foreground"><Link href="#features">Explore</Link><Link href="#how-it-works">How it works</Link><Link href="#support">Support</Link></div></details>
    </header>
  );
}
