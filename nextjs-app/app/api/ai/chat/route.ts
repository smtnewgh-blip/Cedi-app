import { generateAIResponse } from "@/lib/openai";
import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

const MAX_MESSAGE_LENGTH = 2_000;
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: NO_STORE_HEADERS },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const message =
    typeof body === "object" && body !== null && "message" in body
      ? body.message
      : undefined;

  if (
    typeof message !== "string" ||
    message.trim().length === 0 ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return NextResponse.json(
      { error: `Message must be between 1 and ${MAX_MESSAGE_LENGTH} characters` },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  try {
    const response = await generateAIResponse(message.trim());
    return NextResponse.json(
      { message: response },
      { status: 200, headers: NO_STORE_HEADERS },
    );
  } catch (error) {
    console.error("AI chat API error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { status: 200 });
}
