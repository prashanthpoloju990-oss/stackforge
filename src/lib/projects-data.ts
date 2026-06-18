import { type CaseStudy } from "@/components/ui/case-study-modal";

export const projects: CaseStudy[] = [
  {
    title: "Lustara Resort",
    subtitle: "Hospitality · Luxury Hotel & Resort",
    description:
      "A bespoke, high-performance website and booking experience for a 5-star resort, featuring immersive visual layers and an optimized direct reservations workflow.",
    tags: ["Next.js", "Vite", "Tailwind", "Motion", "Vercel"],
    image: "/work/lustara.png",
    metric: "45%",
    metricLabel: "direct booking increase",
    challenge:
      "Lustara Hotel & Resort is a luxury destination, but they struggled with low direct booking rates. Over 68% of their reservations came through third-party Online Travel Agencies (OTAs), costing them 15-20% in commission fees per booking. Their template-based booking platform was slow, had a complex reservation steps flow, and failed to showcase their premium infinity pool, spa, and fine dining experiences online.",
    solution:
      "We designed and built a fast, interactive Next.js digital resort experience. We built custom room explorers, interactive spa reservation schedulers, and integrated a simplified 3-step checkout flow. We utilized high-quality photography with custom Framer Motion parallax sections, optimized performance for sub-second load times globally, and integrated their legacy Property Management System (PMS) via clean REST APIs.",
    results:
      "Within 90 days of launching the new site, Lustara saw a 45% increase in direct, commission-free room bookings. The reservation conversion rate spiked by 2.8x, and average page load times dropped from 4.2 seconds to under 0.8 seconds. Guest satisfaction with the online experience improved dramatically, and the marketing team gained a headless CMS to update packages instantly.",
    testimonial:
      "StackForge delivered a premium digital presence that matches the luxury of our resort. Direct reservations have soared, saving us massive commission fees.",
    testimonialAuthor: "Sarah Mitchell, General Manager at Lustara Resort",
    link: "lustarahotel.vercel.app",
    slug: "lustara",
  },
  {
    title: "Vijaya Outdoors",
    subtitle: "Catering · Premium Experiences",
    description:
      "Bespoke outdoor catering platform with interactive menu designer, event estimator, and high-conversion booking workflow. Designed for premium events in Hyderabad.",
    tags: ["React", "Vite", "Tailwind", "Motion"],
    image: "/work/dinefine-restaurant.png",
    metric: "2.8\u00d7",
    metricLabel: "booking conversion lift",
    challenge:
      "Vijaya Outdoors offers luxury outdoor catering services in Hyderabad, but their previous online presence was a basic website that failed to capture the premium nature of their experiences. Clients had to request quotes via slow email threads, and the sales team struggled to convey custom menu structures and pricing dynamically for events ranging from 50 to 500+ guests.",
    solution:
      "We designed and built a highly interactive Next.js digital experience featuring a real-time event pricing estimator and visual menu designer. The UI captures their luxurious outdoor aesthetic through immersive photography, fluid micro-interactions, and a clean booking flow. We integrated a headless CMS to allow their chefs to update seasonal menus instantly, and built a CRM-linked lead management system for their sales team.",
    results:
      "Within 30 days of launch, Vijaya Outdoors experienced a 2.8\u00d7 increase in direct online booking inquiries. The sales cycle was reduced from 5 days to under 12 hours due to the automated event estimator. Direct client feedback praised the website's ease of use and premium visual alignment with the physical events.",
    testimonial:
      "StackForge captured the soul of our dining experiences online. Our clients are wowed before they even taste the food.",
    testimonialAuthor: "Vijaya Kumar, Founder of Vijaya Outdoors",
    link: "vijayaoutdoors.vercel.app",
    slug: "vijaya-outdoors",
  },
  {
    title: "Pulp Fiction Refined",
    subtitle: "Creative · Portfolio & Typographic Showcase",
    description:
      "A visually-driven portfolio highlighting typography, motion, and editorial design. Focused on immersive reading experiences and refined type systems.",
    tags: ["Next.js", "Tailwind", "Typography", "Motion"],
    image: "/work/pulp-fiction.png",
    metric: "—",
    metricLabel: "visual case study",
    challenge:
      "The project needed to translate dense editorial content into an engaging, readable web experience while preserving typographic nuance across devices.",
    solution:
      "We built a lightweight, typographic-first Next.js site with custom variable-font pairs, responsive typographic scales, and subtle motion that guides reading flow. Images are lazy-loaded and served from an optimized CDN for crisp rendering.",
    results:
      "Improved engagement through longer average session durations and stronger visual identity — the site serves as a high-conversion portfolio for creative leads.",
    testimonial:
      "The design direction captured our voice perfectly and made our editorial work sing on the web.",
    testimonialAuthor: "Akshitha R, Creative Director",
    link: "pulp-fiction-refined.vercel.app",
    slug: "pulp-fiction-refined",
  },
  {
    title: "Noir Salon",
    subtitle: "Local Business · Service Booking & Gallery",
    description:
      "A boutique salon website showcasing services, bookings, and a curated gallery of work with elegant dark-mode-first design treatments.",
    tags: ["Next.js", "Tailwind", "Bookings", "Gallery"],
    image: "/work/noir-salon.png",
    metric: "—",
    metricLabel: "portfolio",
    challenge:
      "Noir Salon needed a premium online presence that highlighted their styling work and made it easy for clients to book appointments.",
    solution:
      "We implemented a streamlined service catalogue, an image-led gallery with lazy-loading, and an integrated booking call-to-action that funnels leads to the salon’s contact flow.",
    results:
      "Higher inbound booking inquiries and a cleaner brand presentation that matches the in-salon experience.",
    testimonial:
      "Our booking calls have doubled and customers mention the website as the reason they chose us.",
    testimonialAuthor: "Owner, Noir Salon",
    link: "https://noir-salon-dauqra9aq-akshitha-s-projects4.vercel.app/",
    slug: "noir-salon",
  },
];
