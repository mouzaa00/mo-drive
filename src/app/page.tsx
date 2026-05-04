import Link from "next/link";
import { Cloud, Shield, Users, Zap } from "lucide-react";

export default async function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-b from-white to-gray-100 flex flex-col">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold tracking-tight">FastDrive</span>
          </div>
          <nav>
            <Link
              href="/drive"
              className="text-sm bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-opacity"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-24 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight">
            Your files, everywhere
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground">
            Store, share, and collaborate on files from anywhere. FastDrive
            keeps everything secure and within reach.
          </p>
          <div className="mt-10">
            <Link
              href="/drive"
              className="bg-primary text-primary-foreground px-6 py-3 rounded-md font-medium hover:opacity-90 transition-opacity"
            >
              Start for free
            </Link>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 pb-24 grid sm:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border">
            <Shield className="h-10 w-10 mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Secure by default</h3>
            <p className="text-sm text-muted-foreground">
              End-to-end encryption keeps your data private and protected.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border">
            <Users className="h-10 w-10 mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Real-time collaboration</h3>
            <p className="text-sm text-muted-foreground">
              Work together on documents, spreadsheets, and more in real time.
            </p>
          </div>
          <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border">
            <Zap className="h-10 w-10 mb-4 text-muted-foreground" />
            <h3 className="font-semibold mb-2">Lightning fast</h3>
            <p className="text-sm text-muted-foreground">
              Upload, download, and access your files with blazing speed.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} FastDrive. All rights reserved.</p>
      </footer>
    </div>
  );
}
