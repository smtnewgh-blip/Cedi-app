import Link from "next/link";
import { AppMark } from "@/components/app-mark";
import { Button } from "@/components/ui/button";
export default function NotFound() { return <main className="grid min-h-screen place-items-center p-5"><div className="max-w-md text-center"><div className="flex justify-center"><AppMark /></div><p className="mt-10 text-sm font-medium text-primary">404</p><h1 className="mt-2 text-3xl font-semibold">This page is not here.</h1><p className="mt-3 text-muted-foreground">The link may be outdated or the page may have moved.</p><Button asChild className="mt-6"><Link href="/">Back to CediApp</Link></Button></div></main>; }
