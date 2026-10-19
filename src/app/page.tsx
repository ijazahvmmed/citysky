import { Hero } from "@/components/home/Hero";
import { Intro } from "@/components/home/Intro";
import { SelectedProjects } from "@/components/home/SelectedProjects";
import { Tiers } from "@/components/sections/Tiers";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { Approach } from "@/components/home/Approach";
import { BuildExperience } from "@/components/build/BuildExperience";
import { Numbers } from "@/components/home/Numbers";
import { JournalPreview } from "@/components/home/JournalPreview";
import { ContactCTA } from "@/components/sections/ContactCTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <SelectedProjects />
      <Tiers />
      <ComparisonTable />
      <Approach />
      <BuildExperience />
      <Numbers />
      <JournalPreview />
      <ContactCTA />
    </>
  );
}
