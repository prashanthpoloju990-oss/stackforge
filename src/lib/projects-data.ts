export interface CaseStudy {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  image: string;
  metric: string;
  metricLabel: string;
  challenge: string;
  solution: string;
  results: string;
  testimonial?: string;
  testimonialAuthor?: string;
  link?: string;
  slug: string;
}

export const projects: CaseStudy[] = [
  {
    title: "Aurea Retreats",
    subtitle: "Hospitality · Luxury Wellness & Mountain Retreat",
    description:
      "A flagship digital sanctuary and direct booking platform for a 5-star eco-wellness retreat, engineered with fluid canvas transitions and sub-second page performance.",
    tags: ["Next.js 15", "React", "Tailwind", "Framer Motion", "Vercel"],
    image: "/work/aurea-retreats.png",
    metric: "52%",
    metricLabel: "direct revenue growth",
    challenge:
      "Aurea Retreats is an ultra-exclusive wellness sanctuary nestled in tropical mountains. Their previous digital platform was slow, reliant on third-party widgets, and suffered high reservation drop-off rates on mobile devices while costing them heavy commissions to Online Travel Agencies.",
    solution:
      "We engineered a custom Next.js 15 resort platform featuring an intuitive villa selection suite, interactive retreat itinerary builders, and real-time reservation synchronization. We crafted fluid scroll-driven animations, high-res webp visual optimization, and a lightweight headless CMS.",
    results:
      "Achieved a 52% increase in direct, commission-free reservations within 60 days of deployment. Mobile booking conversion spiked by 3.1×, while average page load speeds dropped to under 0.6 seconds globally.",
    testimonial:
      "StackForge brought our physical sanctuary to life on the web. Direct reservations surpassed all our expectations and transformed our booking margins.",
    testimonialAuthor: "Elena Rostova, Brand Director at Aurea Retreats",
    link: "https://aurea-retreats.vercel.app/",
    slug: "aurea-retreats",
  },
  {
    title: "Crave & Caviar",
    subtitle: "Culinary · Fine Dining & Gourmet Studio",
    description:
      "An immersive digital culinary showcase and reservation portal for a premier gourmet dining venue, featuring real-time tasting menu previews and instant table booking.",
    tags: ["Next.js", "React", "Tailwind", "Motion", "Vercel"],
    image: "/work/crave-n-cav.png",
    metric: "3.8×",
    metricLabel: "table reservation surge",
    challenge:
      "Crave & Caviar needed a sophisticated web application that matched their Michelin-inspired culinary atmosphere, allowing guests to explore seasonal caviar pairings and reserve tables without third-party portal clutter.",
    solution:
      "We crafted a dark-mode luxury web experience featuring interactive menu pairings, high-resolution culinary showcases, and a streamlined reservation workflow linked directly with their front-of-house concierge team.",
    results:
      "Table reservations surged by 3.8× within 45 days, with over 70% of weekend seatings booked directly through the new web platform.",
    testimonial:
      "The online experience mirrors our dining room's elegance. Our guests frequently compliment the seamless reservation flow.",
    testimonialAuthor: "Chef Antoine Dupont, Founder & Executive Chef",
    link: "https://crave-n-cav.vercel.app/",
    slug: "crave-n-cav",
  },
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
      "Lustara Hotel & Resort is a luxury destination, but they struggled with low direct booking rates. Over 68% of their reservations came through third-party Online Travel Agencies (OTAs), costing them 15-20% in commission fees per booking.",
    solution:
      "We designed and built a fast, interactive Next.js digital resort experience with custom room explorers, interactive spa reservation schedulers, and integrated a simplified 3-step checkout flow.",
    results:
      "Within 90 days of launching the new site, Lustara saw a 45% increase in direct, commission-free room bookings. The reservation conversion rate spiked by 2.8x.",
    testimonial:
      "StackForge delivered a premium digital presence that matches the luxury of our resort. Direct reservations have soared, saving us massive commission fees.",
    testimonialAuthor: "Sarah Mitchell, General Manager at Lustara Resort",
    link: "https://lustarahotel.vercel.app/",
    slug: "lustara",
  },
  {
    title: "Vijaya Outdoors",
    subtitle: "Catering · Premium Experiences",
    description:
      "Bespoke outdoor catering platform with interactive menu designer, event estimator, and high-conversion booking workflow. Designed for premium events in Hyderabad.",
    tags: ["React", "Vite", "Tailwind", "Motion"],
    image: "/work/vijaya-outdoors.png",
    metric: "2.8×",
    metricLabel: "booking conversion lift",
    challenge:
      "Vijaya Outdoors offers luxury outdoor catering services in Hyderabad, but their previous online presence was a basic website that failed to capture the premium nature of their experiences.",
    solution:
      "We designed and built a highly interactive Next.js digital experience featuring a real-time event pricing estimator and visual menu designer. The UI captures their luxurious outdoor aesthetic through immersive photography.",
    results:
      "Within 30 days of launch, Vijaya Outdoors experienced a 2.8× increase in direct online booking inquiries. The sales cycle was reduced from 5 days to under 12 hours.",
    testimonial:
      "StackForge captured the soul of our dining experiences online. Our clients are wowed before they even taste the food.",
    testimonialAuthor: "Vijaya Kumar, Founder of Vijaya Outdoors",
    link: "https://vijayaoutdoors.vercel.app/",
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
      "We built a lightweight, typographic-first Next.js site with custom variable-font pairs, responsive typographic scales, and subtle motion that guides reading flow.",
    results:
      "Improved engagement through longer average session durations and stronger visual identity — the site serves as a high-conversion portfolio for creative leads.",
    testimonial:
      "The design direction captured our voice perfectly and made our editorial work sing on the web.",
    testimonialAuthor: "Akshitha R, Creative Director",
    link: "https://pulp-fiction-refined.vercel.app/",
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
  {
    title: "Haluwa Restaurant",
    subtitle: "Hospitality · Authentic Culinary Experience",
    description:
      "A rich, immersive web application for a premier authentic dining restaurant, featuring dynamic digital menus, table reservation workflows, and culinary showcases.",
    tags: ["React", "Next.js", "Tailwind", "Motion", "Arcada"],
    image: "/work/haluwa-restaurant.png",
    metric: "3.4×",
    metricLabel: "table reservation boost",
    challenge:
      "Haluwa Restaurant required a distinct, appetite-inducing online experience that communicated their traditional culinary roots while modernizing their digital reservation system for high-volume dining hours.",
    solution:
      "We built a high-performance web experience showcasing rich food photography, interactive categorized digital menus with allergen filtering, and a seamless online table booking flow.",
    results:
      "Increased weekend table reservations by 3.4× and boosted customer engagement through interactive menu previews before dining.",
    testimonial:
      "The web experience captured our culinary passion perfectly. Our reservations have reached record highs since launch.",
    testimonialAuthor: "Master Chef & Manager, Haluwa Restaurant",
    link: "https://haluwa-restaurant-pjji.arcada.app/",
    slug: "haluwa-restaurant",
  },
];
