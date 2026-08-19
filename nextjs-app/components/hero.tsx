import Link from "next/link";
import { ArrowRight, BadgeCheck, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const features: { title: string; description: string; icon: LucideIcon }[] = [
  { title: "Guided onboarding", description: "Start with a clear, step-by-step setup experience.", icon: BadgeCheck },
  { title: "Your control", description: "Review activity and account status in one calm dashboard.", icon: ShieldCheck },
  { title: "Built for learning", description: "Explore product concepts with clearly labelled demo data.", icon: Sparkles },
];

export function Hero() {
  return <>
    <section className="grid gap-12 py-16 md:grid-cols-[1.1fr_.9fr] md:py-24">
      <div className="flex flex-col items-start justify-center"><p className="mb-5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">A clearer way to explore digital finance</p><h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">Your CediApp journey, <span className="text-primary">made simple.</span></h1><p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">Learn, organize, and explore CediApp features in a secure, focused space designed for everyday use.</p><div className="mt-8 flex flex-wrap gap-3"><Button asChild size="lg"><Link href="/auth/sign-up">Create an account <ArrowRight /></Link></Button><Button asChild size="lg" variant="outline"><Link href="#how-it-works">See how it works</Link></Button></div><p className="mt-5 text-sm text-muted-foreground">Demo experience only. No real funds or financial advice.</p></div>
      <div className="rounded-3xl border border-primary/15 bg-gradient-to-br from-primary via-primary to-emerald-800 p-6 text-primary-foreground shadow-xl"><p className="text-sm font-medium text-primary-foreground/70">CediApp overview</p><div className="mt-8 rounded-2xl bg-white/10 p-5 backdrop-blur"><p className="text-sm text-primary-foreground/70">Account readiness</p><p className="mt-2 text-3xl font-semibold">Ready to begin</p><div className="mt-6 h-2 rounded-full bg-white/20"><div className="h-full w-2/3 rounded-full bg-amber-300" /></div><p className="mt-3 text-sm text-primary-foreground/80">Complete your profile to unlock the guided dashboard.</p></div><div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/10 p-4"><p className="text-xs text-primary-foreground/70">Security</p><p className="mt-1 font-medium">Protected access</p></div><div className="rounded-xl bg-white/10 p-4"><p className="text-xs text-primary-foreground/70">Mode</p><p className="mt-1 font-medium">Demo data</p></div></div></div>
    </section>
    <section id="features" className="grid gap-4 py-12 md:grid-cols-3">{features.map(({ title, description, icon: Icon }) => <article key={title} className="rounded-2xl border bg-card p-6 shadow-sm"><Icon className="size-5 text-primary" /><h2 className="mt-4 font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p></article>)}</section>
  </>;
}
