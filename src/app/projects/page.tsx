import WorkPage, { metadata as workMetadata } from "@/app/work/page";
import type { Metadata } from "next";

export const metadata: Metadata = {
  ...workMetadata,
  title: "Projects & Portfolio | StackForge",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return <WorkPage />;
}
