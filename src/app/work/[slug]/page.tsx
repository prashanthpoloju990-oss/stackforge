import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Globe, ArrowUpRight } from "lucide-react";
import { projects } from "@/lib/projects-data";
import { Navbar } from "@/components/stackforge/navbar";
import { Footer } from "@/components/stackforge/footer";
import { BlobButton } from "@/components/ui/blob-button";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) {
    return {
      title: "Project Not Found | StackForge",
    };
  }
  const imageUrl = `https://stackforge.co.in${project.image}`;
  return {
    title: `${project.title} | ${project.subtitle} Case Study`,
    description: project.description,
    alternates: {
      canonical: `/work/${slug}`,
    },
    openGraph: {
      title: `${project.title} | ${project.subtitle} Case Study`,
      description: project.description,
      type: "website",
      url: `https://stackforge.co.in/work/${slug}`,
      images: [{ url: imageUrl }],
    },
    twitter: {
      title: `${project.title} | ${project.subtitle} Case Study`,
      description: project.description,
      card: "summary_large_image",
      images: [imageUrl],
    }
  };
}

export default async function WorkPage({ params }: PageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "name": project.title,
    "description": project.description,
    "image": `https://stackforge.co.in${project.image}`,
    "genre": project.subtitle,
    "publisher": {
      "@type": "Organization",
      "name": "StackForge",
      "logo": {
        "@type": "ImageObject",
        "url": "https://stackforge.co.in/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://stackforge.co.in/work/${slug}`
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-forge-bg overflow-x-hidden">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Grain texture overlay */}
      <div className="grain-overlay" aria-hidden="true" />

      <Navbar />

      <main className="flex-1 pt-32 pb-24 relative z-10">
        <div className="max-w-[1000px] mx-auto px-6 md:px-12">
          {/* Back Button */}
          <div className="mb-8">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-fluid-body text-forge-text-secondary/60 hover:text-forge-accent transition-colors duration-200 group font-mono text-sm"
            >
              <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
              Back to Selected Work
            </Link>
          </div>

          {/* Hero Header */}
          <div className="mb-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="text-xs font-mono font-bold px-2.5 py-1 bg-forge-surface border border-forge-border text-forge-text-secondary rounded">
                {project.subtitle}
              </span>
              <div className="flex items-baseline gap-1 bg-forge-accent/15 border border-forge-accent/20 rounded px-2.5 py-0.5 text-xs text-forge-accent font-bold">
                <span className="font-tabular-nums">{project.metric}</span>
                <span className="text-[10px] opacity-80">{project.metricLabel}</span>
              </div>
            </div>

            <h1 className="text-fluid-display font-bold text-forge-text font-playfair mb-6 leading-tight">
              {project.title}
            </h1>

            <p className="text-fluid-h2 text-forge-text-secondary leading-relaxed max-w-[800px]">
              {project.description}
            </p>
          </div>

          {/* Featured Image */}
          <div className="relative w-full aspect-[16/10] md:aspect-[21/9] overflow-hidden rounded-2xl border border-forge-divider shadow-lg mb-16 bg-forge-surface/30">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1000px"
              priority
            />
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
            <div className="md:col-span-2 space-y-12">
              {/* Challenge */}
              <div className="relative group">
                <div className="absolute inset-0 bg-forge-surface/20 border-2 border-forge-text rounded-xl shadow-[4px_4px_0px_0px_var(--forge-accent)] -z-10 transition-all duration-300 group-hover:shadow-[6px_6px_0px_0px_var(--forge-accent)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]" />
                <div className="p-8">
                  <h2 className="text-fluid-h3 font-bold text-forge-text font-syne mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-forge-accent rounded-full animate-pulse" />
                    The Challenge
                  </h2>
                  <p className="text-fluid-body-lg text-forge-text-secondary leading-relaxed">
                    {project.challenge}
                  </p>
                </div>
              </div>

              {/* Solution */}
              <div className="relative group">
                <div className="absolute inset-0 bg-forge-surface/20 border-2 border-forge-text rounded-xl shadow-[4px_4px_0px_0px_var(--forge-accent)] -z-10 transition-all duration-300 group-hover:shadow-[6px_6px_0px_0px_var(--forge-accent)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]" />
                <div className="p-8">
                  <h2 className="text-fluid-h3 font-bold text-forge-text font-syne mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-forge-accent rounded-full animate-pulse" />
                    Our Solution
                  </h2>
                  <p className="text-fluid-body-lg text-forge-text-secondary leading-relaxed">
                    {project.solution}
                  </p>
                </div>
              </div>

              {/* Results */}
              <div className="relative group">
                <div className="absolute inset-0 bg-forge-surface/20 border-2 border-forge-text rounded-xl shadow-[4px_4px_0px_0px_var(--forge-accent)] -z-10 transition-all duration-300 group-hover:shadow-[6px_6px_0px_0px_var(--forge-accent)] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px]" />
                <div className="p-8">
                  <h2 className="text-fluid-h3 font-bold text-forge-text font-syne mb-4 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-forge-accent rounded-full animate-pulse" />
                    The Results
                  </h2>
                  <p className="text-fluid-body-lg text-forge-text-secondary leading-relaxed">
                    {project.results}
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar / Info */}
            <div className="space-y-8">
              {/* Project Meta Card */}
              <div className="bg-forge-surface/40 border-2 border-forge-text rounded-xl p-6 space-y-6 shadow-[4px_4px_0px_0px_var(--forge-accent)]">
                <div>
                  <h4 className="text-[10px] font-mono font-bold text-forge-text-secondary/50 uppercase tracking-widest mb-2">
                    Technologies Used
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2.5 py-1 text-xs font-medium bg-forge-bg border border-forge-divider text-forge-text-secondary rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {project.link && (
                  <div>
                    <h4 className="text-[10px] font-mono font-bold text-forge-text-secondary/50 uppercase tracking-widest mb-2">
                      Live Project
                    </h4>
                    <a
                      href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-forge-accent font-bold text-sm hover:underline font-mono group"
                    >
                      <Globe className="w-4 h-4 text-forge-accent" />
                      {project.link}
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </div>
                )}
              </div>

              {/* Testimonial Card */}
              {project.testimonial && (
                <div className="bg-forge-accent/5 border-2 border-forge-text rounded-xl p-6 relative shadow-[4px_4px_0px_0px_var(--forge-accent)]">
                  <p className="text-fluid-body text-forge-text italic relative z-10 leading-relaxed mb-4">
                    &ldquo;{project.testimonial}&rdquo;
                  </p>
                  {project.testimonialAuthor && (
                    <p className="text-xs font-mono font-bold text-forge-text-secondary/70">
                      — {project.testimonialAuthor}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Action Footer */}
          <div className="border-t border-forge-divider/45 pt-12 flex flex-wrap items-center justify-between gap-6">
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 text-fluid-body text-forge-text-secondary hover:text-forge-accent transition-colors duration-200 font-mono text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to selected work
            </Link>

            <div className="flex gap-4">
              {project.link && (
                <a
                  href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border-2 border-forge-text text-forge-text hover:bg-forge-surface hover:shadow-[3px_3px_0px_0px_var(--forge-accent)] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all duration-200 text-sm font-semibold"
                >
                  Visit Live Site
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              )}

              <BlobButton
                asChild
                className="h-10 px-6 rounded-full border-2 border-forge-text font-bold text-xs uppercase tracking-wider relative shadow-[3px_3px_0px_0px_var(--forge-accent)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_var(--forge-accent)] active:translate-x-0 active:translate-y-0 active:shadow-[1px_1px_0px_0px] bg-forge-accent text-white"
              >
                <Link href="/start-project">
                  Start Your Project
                </Link>
              </BlobButton>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
