import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experiences } from "@/components/sections/experiences";
import { PortfolioTabs } from "@/components/portfolio/portfolio-tabs";
import { Contact } from "@/components/sections/contact";
import { Comments } from "@/components/comments";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  getProfile,
  getSkills,
  getPublishedProjects,
  getExperiences,
  getEducation,
  getComments,
} from "@/lib/data";

export const revalidate = 300;

export default async function HomePage() {
  const [profile, skills, projects, experiences, education, comments] =
    await Promise.all([
      getProfile(),
      getSkills(),
      getPublishedProjects(),
      getExperiences(),
      getEducation(),
      getComments(),
    ]);

  return (
    <>
      <Hero
        profile={profile}
        skills={skills}
        projectCount={projects.length}
        experienceCount={experiences.length}
      />

      {/* À propos */}
      <About profile={profile} />
      <Experiences experiences={experiences} />

      {/* Portfolio */}
      <section id="portfolio" className="py-20">
        <Container>
          <SectionHeading
            eyebrow="Portfolio"
            title="Compétences, projets & formations"
            description="Explore mes compétences, mes réalisations et mon parcours de formation."
            className="mx-auto max-w-2xl text-center"
          />
        </Container>
        <PortfolioTabs skills={skills} projects={projects} education={education} />
      </section>

      {/* Contact */}
      <Contact profile={profile} />
      <Comments initial={comments} />
    </>
  );
}
