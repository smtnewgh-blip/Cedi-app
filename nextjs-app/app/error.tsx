"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="grid min-h-screen place-items-center p-5"><div className="max-w-md text-center"><p className="text-sm font-medium text-primary">Something went wrong</p><h1 className="mt-2 text-3xl font-semibold">Let’s get you back on track.</h1><p className="mt-3 text-muted-foreground">Try again, or return to the CediApp home page.</p><div className="mt-6 flex justify-center gap-3"><Button onClick={reset}>Try again</Button><Button asChild variant="outline"><Link href="/">Go home</Link></Button></div></div></main>; }
