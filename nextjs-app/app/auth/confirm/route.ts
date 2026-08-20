import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

function getSafeNextPath(value: string | null): string {
  if (!value?.startsWith("/") || value[1] === "/" || value[1] === "\\") {
    return "/";
  }

  return value;
}

function redirectToError(): never {
  redirect("/auth/error");
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = getSafeNextPath(searchParams.get("next"));

  if (!tokenHash || !type) {
    redirectToError();
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    redirectToError();
  }

  redirect(next);
}
