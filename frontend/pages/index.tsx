import Head from "next/head";
import Link from "next/link";
import { ArrowRight, Users, CreditCard, Send, HeartPulse } from "lucide-react";

export default function Home() {
  return (
    <>
      <Head>
        <title>Remoove – Fintech Sandbox</title>
        <meta name="description" content="Frontend sandbox to exercise the Remoove/Bridge backend APIs." />
      </Head>

      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        {/* Background layers */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-radials" />
          <div className="absolute inset-0 bg-grid" />
        </div>

        {/* Header */}
        <header className="relative z-10 flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/20 ring-1 ring-primary/50" />
            <span className="text-lg font-semibold tracking-wide">Remoove Tester</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a className="hover:text-foreground transition-colors" href="https://vercel.com/docs" target="_blank" rel="noreferrer">Docs</a>
            <a className="hover:text-foreground transition-colors" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a>
          </nav>
        </header>

        {/* Hero */}
        <main className="relative z-10 px-6">
          <section className="mx-auto max-w-5xl py-16 text-center">
            <h1 className="mx-auto max-w-3xl text-4xl md:text-6xl font-bold tracking-tight">
              Testez vos APIs{" "}
              <span className="bg-gradient-to-r from-sky-400 to-emerald-400 bg-clip-text text-transparent">
                Remoove / Bridge
              </span>
              {" "}en toute simplicité
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Un starter frontend prêt pour Vercel : SSR sûr, pas de localStorage côté serveur, et aucun react-router.
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <Link
                href="/customers"
                className="inline-flex items-center gap-2 rounded-lg bg-white/90 px-4 py-2 text-slate-900 hover:bg-white"
              >
                Commencer
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="https://render.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg glass px-4 py-2"
              >
                Backend (Render)
              </a>
            </div>
          </section>

          {/* Feature grid */}
          <section className="mx-auto grid max-w-5xl grid-cols-1 gap-4 pb-24 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              href="/customers"
              title="Customers"
              description="Créer et lister des clients dans le sandbox."
              Icon={Users}
            />
            <FeatureCard
              href="/transfers"
              title="Transfers"
              description="Simuler des virements entre comptes."
              Icon={Send}
            />
            <FeatureCard
              href="/cards"
              title="Issue card"
              description="Émettre des cartes virtuelles de test."
              Icon={CreditCard}
            />
            <FeatureCard
              href="/health"
              title="Sandbox health"
              description="Vérifier la configuration des clés côté serveur."
              Icon={HeartPulse}
            />
          </section>
        </main>

        {/* Footer */}
        <footer className="relative z-10 border-t border-white/10 px-6 py-6 text-center text-xs text-muted-foreground">
          Fait avec Next.js 14 + Tailwind. Déployable sans douleur sur Vercel.
        </footer>
      </div>
    </>
  );
}

type IconType = React.ComponentType<{ className?: string }>;

function FeatureCard({
  href,
  title,
  description,
  Icon
}: {
  href: string;
  title: string;
  description: string;
  Icon: IconType;
}) {
  return (
    <Link
      href={href}
      className="group glass relative block rounded-xl p-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-primary/15 p-2 ring-1 ring-primary/40">
            <Icon className="h-5 w-5" />
          </div>
          <h3 className="text-base font-semibold">{title}</h3>
        </div>
        <ArrowRight className="h-4 w-4 opacity-50 transition group-hover:translate-x-1 group-hover:opacity-100" />
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </Link>
  );
}