import { AppMark } from "@/components/app-mark";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Suspense } from "react";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return <main className="min-h-screen bg-muted/30"><header className="border-b bg-background"><div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5"><AppMark /><nav className="hidden gap-5 text-sm text-muted-foreground sm:flex"><Link href="/protected" className="text-foreground">Overview</Link><a href="mailto:support@cediapp.space">Support</a></nav><div className="flex items-center gap-3"><ThemeSwitcher /><Suspense><AuthButton /></Suspense></div></div></header><div className="mx-auto max-w-6xl px-5 py-8">{children}</div></main>;
}
