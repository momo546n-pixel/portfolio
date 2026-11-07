import { Mail } from "lucide-react";
import { GithubIcon } from "@/components/icons/github";
import { LinkedinIcon } from "@/components/icons/linkedin";
import { LINKEDIN_URL } from "@/lib/site";

export function Footer({
  name,
  email,
  githubUrl,
}: {
  name: string;
  email?: string | null;
  githubUrl?: string | null;
}) {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">
          © {year} {name}. Tous droits réservés.
        </p>
        <div className="flex items-center gap-3">
          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground active:scale-90"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
          )}
          {email && (
            <a
              href={`mailto:${email}`}
              aria-label="E-mail"
              className="text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground active:scale-90"
            >
              <Mail className="h-5 w-5" />
            </a>
          )}
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:text-foreground active:scale-90"
          >
            <LinkedinIcon className="h-5 w-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
