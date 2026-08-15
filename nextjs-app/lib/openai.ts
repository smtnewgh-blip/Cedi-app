import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

// Only instantiate the OpenAI client when a valid API key is configured.
// This keeps the application functional in environments (such as local
// development or deployments without credentials) where no key is available.
const client = apiKey && apiKey.trim() !== "" ? new OpenAI({ apiKey }) : null;

const FALLBACK_MESSAGE =
  "Hi! The CediApp assistant is running in demo mode because no OpenAI API key " +
  "is configured. I can help you explore the CediApp ecosystem — including CediCoin, " +
  "currency conversion, the Unique ID Wallet, SusuBank+ savings circles, EduToken " +
  "rewards, and tokenized-market concepts. Ask me anything about these features!";

export async function generateAIResponse(message: string): Promise<string> {
  if (!client) {
    return FALLBACK_MESSAGE;
  }

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are the CediApp assistant, a helpful guide for the CediApp ecosystem — " +
            "a Ghana-focused platform combining the CediCoin digital currency dashboard with " +
            "features like currency conversion, tokenized markets, staking, a self-custody " +
            "Unique ID Wallet (Ghana Card, DVLA credentials, permits), SusuBank+ savings " +
            "circles, transport loyalty, peer-finance, EduToken learning rewards, and more. " +
            "Keep answers concise, friendly, and grounded in these product concepts. Never " +
            "present demo data as verified financial or legal information.",
        },
        { role: "user", content: message },
      ],
      max_tokens: 800,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return "I received an empty response. Please try again.";
    }
    return content;
  } catch (error) {
    console.error("OpenAI request failed, falling back to demo mode:", error);
    return FALLBACK_MESSAGE;
  }
}
