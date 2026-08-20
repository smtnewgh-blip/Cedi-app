import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ProfileCompletion } from "@/components/profile-completion";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const fallbackName = typeof data?.claims?.user_metadata?.full_name === "string" ? data.claims.user_metadata.full_name : "";
  const { data: profile } = await supabase.from("profiles").select("display_name").maybeSingle();
  return <div className="max-w-2xl space-y-6"><Button asChild variant="ghost" className="px-0"><Link href="/protected"><ArrowLeft /> Dashboard</Link></Button><div><p className="text-sm font-medium text-primary">Account settings</p><h1 className="mt-1 text-3xl font-semibold">Profile and privacy</h1><p className="mt-2 text-muted-foreground">Control the details used in your CediApp experience.</p></div><ProfileCompletion initialName={profile?.display_name || fallbackName} /><section className="rounded-2xl border bg-card p-6"><ShieldCheck className="size-5 text-primary" /><h2 className="mt-3 font-semibold">Privacy by design</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Your profile and activity records are protected with row-level security once the included Supabase migration is applied.</p></section></div>;
}
