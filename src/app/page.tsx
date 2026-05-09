import Link from "next/link";
import { Shield, Users, Zap } from "lucide-react";
import { Button } from "~/components/ui/button";
import { auth } from "~/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/drive");
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-100 flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <h1 className="text-xl font-medium ">
              <span className="text-blue-700">Fast</span>Drive
            </h1>
          </div>
          <nav className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-blue-700 hover:bg-blue-700/80">
              <Link href="/signup">Get started</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-primary">
            Your files, everywhere
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Store, share, and collaborate on files from anywhere.{" "}
            <span className="text-blue-700">Fast</span>Drive keeps everything
            secure and within reach.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="bg-blue-700 hover:bg-blue-700/80"
            >
              <Link href="/signup">Get started</Link>
            </Button>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24 grid sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border">
            <Shield className="h-10 w-10 mb-4 text-blue-700" />
            <h3 className="font-semibold mb-2">Secure by default</h3>
            <p className="text-sm text-muted-foreground">
              End-to-end encryption keeps your data private and protected.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border">
            <Users className="h-10 w-10 mb-4 text-blue-700" />
            <h3 className="font-semibold mb-2">Real-time collaboration</h3>
            <p className="text-sm text-muted-foreground">
              Work together on documents, spreadsheets, and more in real time.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border">
            <Zap className="h-10 w-10 mb-4 text-blue-700" />
            <h3 className="font-semibold mb-2">Lightning fast</h3>
            <p className="text-sm text-muted-foreground">
              Upload, download, and access your files with blazing speed.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>
          &copy; {new Date().getFullYear()} QuickDrive. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
