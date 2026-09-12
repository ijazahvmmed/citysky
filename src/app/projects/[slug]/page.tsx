import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, getProject } from "@/lib/data/projects";
import { imageSrc } from "@/lib/images";
import { ProjectHero } from "@/components/projects/ProjectHero";
import { ProjectOverview } from "@/components/projects/ProjectOverview";
import { ProjectGallery } from "@/components/projects/ProjectGallery";
import { FloorPlans } from "@/components/projects/FloorPlans";
import { Specs } from "@/components/projects/Specs";
import { Tiers } from "@/components/sections/Tiers";
import { TierSwitcher } from "@/components/projects/TierSwitcher";
import { LocationMap } from "@/components/projects/LocationMap";
import { CatalogDownload } from "@/components/projects/CatalogDownload";
import { NextProject } from "@/components/projects/NextProject";
import { ProjectAnalytics } from "@/components/projects/ProjectAnalytics";
import { ContactCTA } from "@/components/sections/ContactCTA";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: project.name,
    description: `${project.summary} ${project.unitTypes} in ${project.location}. ${project.status}.`,
    openGraph: {
      images: [{ url: imageSrc(project.cover, 1600), alt: project.cover.alt }],
    },
  };
}

export default async function ProjectPage({
  params,
}: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <ProjectAnalytics project={project.name} />
      <ProjectHero project={project} />
      <ProjectOverview project={project} />
      <ProjectGallery items={project.gallery} />
      <FloorPlans plans={project.floorPlans} />
      <Specs specs={project.specs} />
      <Tiers project={project} showCompare={false} />
      <TierSwitcher project={project} />
      <LocationMap project={project} />
      <CatalogDownload project={project} />
      <NextProject project={next} />
      {project.soldOut ? (
        <ContactCTA
          headline="This one is finished. Ask about what we are building now."
          copy={`${project.name} is complete and sold out. Mirzad Road and Taqva Road are open, at every level of finish.`}
          section="project-cta-sold-out"
        />
      ) : (
        <ContactCTA project={project.name} section="project-cta" />
      )}
    </>
  );
}
