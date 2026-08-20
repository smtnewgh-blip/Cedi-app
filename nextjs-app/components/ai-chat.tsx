"use client";

import { FormEvent, useState } from "react";
import { ArrowUp, Bot, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";

type Message = { role: "assistant" | "user"; content: string };
const initialMessages: Message[] = [{ role: "assistant", content: "Welcome to CediApp. Ask about the dashboard or the product concepts you would like to explore." }];

export function AiChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || isSending) return;
    setInput(""); setError(""); setIsSending(true); setMessages((current) => [...current, { role: "user", content: message }]);
    try {
      const response = await fetch("/api/ai/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
      const body = await response.json() as { message?: string; error?: string };
      if (!response.ok || !body.message) throw new Error(body.error || "The assistant is unavailable.");
      setMessages((current) => [...current, { role: "assistant", content: body.message! }]);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The assistant is unavailable.");
    } finally { setIsSending(false); }
  }

  return <section className="rounded-2xl border bg-card shadow-sm"><div className="border-b p-6"><div className="flex items-center gap-2"><Bot className="size-5 text-primary" /><div><p className="font-semibold">CediApp assistant</p><p className="text-sm text-muted-foreground">Product guidance, not financial or legal advice.</p></div></div></div><div className="max-h-80 space-y-4 overflow-y-auto p-6" aria-live="polite">{messages.map((message, index) => <div className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`} key={`${message.role}-${index}`}><div className={`rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>{message.role === "assistant" ? <Bot className="mb-2 size-4" /> : <UserRound className="mb-2 size-4" />}{message.content}</div></div>)}{isSending && <p className="text-sm text-muted-foreground">Assistant is thinking...</p>}</div><form onSubmit={sendMessage} className="border-t p-4"><label className="sr-only" htmlFor="chat-message">Ask the CediApp assistant</label><div className="flex gap-2"><input id="chat-message" className="flex h-10 min-w-0 flex-1 rounded-md border bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" maxLength={2000} value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask a question..." /><Button type="submit" size="icon" disabled={isSending || !input.trim()} aria-label="Send message"><ArrowUp /></Button></div>{error && <p className="mt-2 text-sm text-red-600" role="alert">{error}</p>}</form></section>;
}
