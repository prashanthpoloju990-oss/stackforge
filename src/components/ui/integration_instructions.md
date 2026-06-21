# React Component Integration Guide

This guide explains how to set up, structure, and integrate custom React components like the `FormBuilderHero` into codebases supporting Tailwind CSS, TypeScript, and shadcn UI.

---

## 1. Project Prerequisites

If your project does not currently support these technologies, follow these instructions to set them up:

### A. Setting Up TypeScript
If your project is currently JavaScript-only:
1. Install TypeScript and typing definitions:
   ```bash
   npm install -D typescript @types/react @types/react-dom @types/node
   ```
2. Initialize the TypeScript configuration file:
   ```bash
   npx tsc --init
   ```
3. Rename your `.js`/`.jsx` files to `.ts`/`.tsx`.

### B. Setting Up Tailwind CSS (v4)
1. Install Tailwind CSS and its PostCSS integration:
   ```bash
   npm install tailwindcss @tailwindcss/postcss postcss
   ```
2. Import Tailwind inside your global CSS file (e.g., `src/app/globals.css`):
   ```css
   @import "tailwindcss";
   ```

### C. Setting Up shadcn UI
1. Initialize shadcn UI via CLI:
   ```bash
   npx shadcn@latest init
   ```
2. This creates the `components.json` configuration file, which tracks paths for reusable components, utility libraries, and styles.

---

## 2. Determining Default Component Paths

### A. Default Path Architecture
- **Default Path**: In a standard Next.js project with a `src/` directory, components are placed inside `src/components/ui/` and global styles in `src/app/globals.css` (or `src/styles/globals.css`).
- **If Not Default**: If your project is not configured to use `src/`, the default path might be `/components/ui/` in the project root.

### B. Why Creating the `/components/ui` Folder is Critical
1. **CLI Synchronization**: The shadcn CLI depends on the configuration file (`components.json`) to find where to add components (like buttons, inputs, select boxes). Setting the default directory to `components/ui` ensures the CLI adds components to the correct folder instead of dumping them in random directories.
2. **Path Aliasing**: Modern React projects use path aliases (like `@/components/ui/...`). Keeping a standard folder structure makes imports clean and prevents relative path complexity (`../../components/ui`).
3. **Architecture Consistency**: Separates generic UI primitives (buttons, dialogs, form elements) from layout-specific page features.

---

## 3. Integration Guidelines

1. **Analyze Component Structure**: Identify external dependencies. In the case of `FormBuilderHero`, it uses `framer-motion`, `lucide-react`, and the custom shadcn `Button` component.
2. **Install Required NPM Dependencies**:
   ```bash
   npm install lucide-react framer-motion @radix-ui/react-slot class-variance-authority
   ```
3. **Register Custom Assets**: Fill image placeholders with authentic Unsplash image URLs to ensure a visually complete experience.
4. **Scrutinize Props & Responsive Behaviors**: Review responsive layouts (`flex-col md:flex-row`, text sizes) to make sure they adapt well across viewports.
