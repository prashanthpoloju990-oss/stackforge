---
Task ID: 2
Agent: Main Agent
Task: Build premium hero section with two-column layout

Work Log:
- Read existing hero.tsx, globals.css, page.tsx
- Created src/components/stackforge/hero-visual.tsx — client component with layered UI panels:
  - Back panel (browser-style with dots, faux content rows, grid cards)
  - Middle panel (overlapping, chart bars with one orange highlight, stats footer)
  - Floating accent line (orange, subtle)
  - Status card (bottom-left, green indicator)
  - Deploy version card (top-right, orange accent border)
  - Subtle dot grid background overlay
  - hero-float-1 (vertical, 6-9s cycles) and hero-float-2 (multi-axis, 8-9s cycles) animations
- Added CSS keyframe animations to globals.css:
  - hero-float-1, hero-float-2 for panel floating
  - hero-text-enter for staggered text entrance
  - hero-text-animate class variants with delays
  - .hero-dots class for dot grid pattern
- Updated hero.tsx with two-column layout:
  - Left column: eyebrow badge, new headline "Built for Performance. Designed for Growth.", subtext, two CTA buttons, trust indicators (50+ Projects, 99.9% Uptime, 24h Response)
  - Right column: HeroVisual (hidden on mobile)
  - Subtle radial gradient background (barely visible orange glow at 60% 50%)
  - min-height 90dvh, responsive grid (stacks on mobile, gap-16 on lg)
  - Staggered entrance animations (eyebrow → headline → subtext → buttons → stats)
  - Primary button: rounded-lg, #FF6A00 bg, darken on hover, scale on active
  - Secondary button: rounded-lg, #2A2F36 border, bg fill on hover
- ESLint passed clean
- Browser verified: hero section renders, two-column grid confirmed, CTA buttons present, layered panels render with chart/dot grid, zero console errors

Stage Summary:
- Premium two-column hero with abstract layered UI visual on right
- All text, buttons, animations, and trust indicators rendering correctly
- Subtle radial gradient background, dot grid, floating panels
- Fully responsive (stacks on mobile, visual hidden on small screens)
- Files modified: hero.tsx, globals.css
- Files created: hero-visual.tsx
