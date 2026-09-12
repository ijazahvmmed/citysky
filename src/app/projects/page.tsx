import type { Metadata } from "next";
import { ProjectsIndex } from "@/components/projects/ProjectsIndex";
import { ContactCTA } from "@/components/sections/ContactCTA";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Completed, ongoing and upcoming homes by Citysky Builders in Nettoor and Vaduthala, Kochi.",
};

export default function ProjectsPage() {
  return (
    <>
      <ProjectsIndex />
      <ContactCTA
        headline="Walk one of them with us."
        copy="Every completed project can be visited by appointment. Message us on WhatsApp and we will set a time."
      />
    </>
  );
}
