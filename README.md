# StackForge | Premium Digital Engineering Studio

StackForge is a state-of-the-art, high-performance web application representing a premium digital engineering studio. Built with **Next.js 15+**, **React 19**, **Tailwind CSS v4**, and **TypeScript**, the codebase features advanced CSS animations, custom shader backgrounds, fluid layouts, and a responsive glassmorphism UI.

---

## 🚀 Key Features

- **Liquid Glass Design System:** Harmonious HSL/OKLCH color system with dark mode priority, backdrop blurs, and glassmorphism styling.
- **Fluid Typography & Layouts:** Fully responsive scaling across all viewports using CSS `clamp()` utilities without breakpoint jumps.
- **Overlapping Card-Stack Process:** A sticky scrolling timeline/process section that layers steps dynamically as the user scrolls.
- **Custom WebGL Aurora/Shader Backgrounds:** Interactive background shaders using raw canvas and Three.js/OGL for an immersive user experience.
- **Fluid Multi-Step Contact System:** High-converting, interactive contact funnel with animated step progressions.
- **Optimized Performance:** GPU-composited layers, image lazy-loading, next-generation font preloading, and smooth passive event listeners.
- **SEO & Accessibility Optimized:** Dynamic sitemaps, structured JSON-LD data, meta descriptions, and accessible skip-links.

---

## 🛠️ Technology Stack

- **Framework:** Next.js (App Router)
- **Runtime:** Bun / Node.js
- **Styling:** Tailwind CSS v4, Vanilla CSS variables
- **Animations:** Framer Motion (`motion/react`)
- **Graphics/Shaders:** Three.js, OGL
- **Database (ORM):** Prisma
- **Form Handling:** Native React Hooks
- **Icons:** Lucide React

---

## 📂 Project Structure

```text
src/
├── app/                  # Next.js App Router (Routes & API endpoints)
│   ├── api/              # Backend routes (e.g. contact form submission)
│   ├── blog/             # Studio blog articles page
│   ├── work/             # Portfolio case studies detail routing
│   ├── globals.css       # Core Tailwind CSS, theme variables, fluid metrics
│   ├── layout.tsx        # HTML wrapper, ThemeProvider, global fonts setup
│   └── page.tsx          # Homepage layout composed of individual sections
├── components/           # React Components
│   ├── stackforge/       # Page components (Hero, Work, Process, Contact, etc.)
│   └── ui/               # Reusable UI primitives (buttons, modals, scroll-bars)
├── hooks/                # Custom hooks (scroll animations, counting animations)
├── lib/                  # Shared data and utility files
```

---

## ⚙️ Local Development

### Prerequisites
Make sure you have **Bun** or **Node.js** installed on your system.

### 1. Install Dependencies
```bash
bun install
# or
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://..."
# Add other variables if needed
```

### 3. Spin Up Dev Server
```bash
bun run dev
# or
npm run dev
```
Open `http://localhost:3000` to view the application.

### 4. Build for Production
```bash
bun run build
# or
npm run build
```

---

## 📝 License

This project is proprietary and custom-built for **StackForge**. All rights reserved.
