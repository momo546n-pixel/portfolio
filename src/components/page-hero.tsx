import { Container } from "@/components/ui/container";

/** Bandeau de titre sombre et coloré, en tête des sous-pages. */
export function PageHero({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative -mt-16 overflow-hidden border-b border-white/10 bg-[#0b0b12] pb-16 pt-32 text-white">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -top-20 left-1/4 h-72 w-72 rounded-full bg-violet-600/30 blur-[110px]" />
        <div className="animate-blob absolute right-10 top-0 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-[110px] [animation-delay:4s]" />
        <div className="bg-grid-dark absolute inset-0 opacity-25" />
      </div>
      <Container className="relative text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>
        {subtitle && (
          <p className="mx-auto mt-3 max-w-xl text-white/60">{subtitle}</p>
        )}
      </Container>
    </section>
  );
}
