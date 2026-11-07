import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/contact-form";
import { Mail, Phone, MapPin } from "lucide-react";
import { GithubIcon } from "@/components/icons/github";
import { LinkedinIcon } from "@/components/icons/linkedin";
import { LINKEDIN_URL } from "@/lib/site";
import type { Profile } from "@/lib/types";

export function Contact({ profile }: { profile: Profile | null }) {
  return (
    <section id="contact" className="bg-muted/40 py-20">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Travaillons ensemble"
          description="Une question, une opportunité, un projet ? Écrivez-moi."
        />
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div className="space-y-4 text-sm">
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 transition-colors hover:text-foreground"
              >
                <Mail className="h-5 w-5 text-accent" />
                {profile.email}
              </a>
            )}
            {profile?.phone && (
              <a
                href={`tel:${profile.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 transition-colors hover:text-foreground"
              >
                <Phone className="h-5 w-5 text-accent" />
                {profile.phone}
              </a>
            )}
            {profile?.location && (
              <p className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-accent" />
                {profile.location}
              </p>
            )}
            {profile?.github_url && (
              <a
                href={profile.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 transition-colors hover:text-foreground"
              >
                <GithubIcon className="h-5 w-5 text-accent shrink-0" />
                GitHub
              </a>
            )}
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 transition-colors hover:text-foreground"
            >
              <LinkedinIcon className="h-5 w-5 text-accent shrink-0" />
              LinkedIn
            </a>
          </div>
          <ContactForm />
        </div>
      </Container>
    </section>
  );
}
