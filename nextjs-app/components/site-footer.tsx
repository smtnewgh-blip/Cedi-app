import Link from "next/link";
import { AppMark } from "@/components/app-mark";

export function SiteFooter() {
  return <footer id="support" className="border-t border-border bg-card"><div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 text-sm md:grid-cols-2"><div><AppMark /><p className="mt-3 max-w-sm text-muted-foreground">A transparent, demo-first experience for exploring CediApp concepts. It is not a bank, wallet, or investment service.</p></div><div className="flex gap-6 md:justify-end"><Link className="text-muted-foreground hover:text-foreground" href="/auth/login">Account</Link><a className="text-muted-foreground hover:text-foreground" href="mailto:support@cediapp.space">Support</a></div></div></footer>;
}
