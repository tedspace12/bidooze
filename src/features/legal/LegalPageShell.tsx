import Link from "next/link";
import type { ReactNode } from "react";

type LegalFact = {
  label: string;
  value: ReactNode;
};

type LegalPageShellProps = {
  title: string;
  summary: string;
  effectiveDate: string;
  facts: LegalFact[];
  children: ReactNode;
};

export default function LegalPageShell({
  title,
  summary,
  effectiveDate,
  facts,
  children,
}: LegalPageShellProps) {
  return (
    <main className="bg-background">
      <section className="border-b border-border bg-linear-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 py-10 md:py-14">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="transition-colors hover:text-foreground">
              Home
            </Link>
            <span>/</span>
            <span aria-current="page" className="text-foreground">
              {title}
            </span>
          </div>

          <div className="max-w-4xl space-y-5">
            <div className="inline-flex rounded-full border border-primary/20 bg-background/80 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              Public Legal Notice
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                {title}
              </h1>
              <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
                {summary}
              </p>
              <p className="text-sm font-medium text-foreground">
                Effective date: {effectiveDate}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid gap-4 md:grid-cols-3">
          {facts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                {fact.label}
              </p>
              <div className="mt-2 text-sm leading-6 text-foreground">{fact.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-14 md:pb-20">
        <div className="max-w-4xl space-y-8 rounded-3xl border border-border bg-card p-6 shadow-sm md:p-8">
          {children}
        </div>
      </section>
    </main>
  );
}
