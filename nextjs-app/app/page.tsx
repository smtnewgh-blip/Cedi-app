import { Hero } from "@/components/hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() { return <main><SiteHeader /><div className="mx-auto max-w-6xl px-5"><Hero /><section id="how-it-works" className="border-t py-16"><p className="text-sm font-medium text-primary">How it works</p><h2 className="mt-2 text-3xl font-semibold tracking-tight">Three deliberate steps, no surprises.</h2><ol className="mt-8 grid gap-5 md:grid-cols-3">{["Create your account", "Complete your profile", "Explore your dashboard"].map((step, i) => <li key={step} className="rounded-2xl bg-muted/50 p-6"><span className="text-sm font-semibold text-primary">0{i + 1}</span><p className="mt-8 font-medium">{step}</p></li>)}</ol></section></div><SiteFooter /></main>; }
