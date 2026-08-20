"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileCompletionProps = { initialName: string };

export function ProfileCompletion({ initialName }: ProfileCompletionProps) {
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    const supabase = createClient();
    const displayName = name.trim();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setStatus("error"); return; }
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, display_name: displayName || null }, { onConflict: "id" });
    if (!error) await supabase.auth.updateUser({ data: { full_name: displayName } });
    setStatus(error ? "error" : "saved");
  }

  return <section className="rounded-2xl border bg-card p-6 shadow-sm"><p className="text-sm font-medium text-primary">Profile</p><h2 className="mt-1 text-xl font-semibold">Make CediApp yours</h2><p className="mt-2 text-sm text-muted-foreground">Your name is stored in your account profile and shown only in this experience.</p><form className="mt-5 space-y-4" onSubmit={saveProfile}><div className="space-y-2"><Label htmlFor="full-name">Display name</Label><Input id="full-name" value={name} maxLength={80} onChange={(event) => setName(event.target.value)} placeholder="Your name" autoComplete="name" /></div>{status === "error" && <p className="text-sm text-red-600" role="alert">We could not save your profile. Please try again.</p>}{status === "saved" && <p className="flex items-center gap-2 text-sm text-primary" role="status"><CheckCircle2 className="size-4" /> Profile saved.</p>}<Button type="submit" disabled={status === "saving"}>{status === "saving" ? "Saving..." : "Save profile"}</Button></form></section>;
}
