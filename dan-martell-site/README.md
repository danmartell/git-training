# Dan Martell — Personal Website

A world-class personal website for Dan Martell, built with Next.js 14, Framer Motion, and Tailwind CSS.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** — Utility-first styling
- **Framer Motion** — Scroll-triggered animations, 3D book tilt, staggered reveals
- **Puppeteer** — Automated visual QA testing

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
npm start
```

## Sections

1. **Hero** — Staggered word-by-word animation, stats counter, scroll indicator
2. **About** — Origin story with slide-in animations
3. **Buy Back Your Time** — 3D perspective book cover with tilt-on-hover, WSJ badge
4. **SaaS Academy** — Results grid, client logos, apply CTA
5. **Speaking** — Topics, past stages, booking CTA
6. **Investing** — Portfolio logos, criteria, pitch CTA
7. **Content Hub** — YouTube, podcast, newsletter cards
8. **Footer** — Social links, quick nav

## Visual QA Testing

```bash
# Start the dev server first
npm run dev

# In another terminal, run the QA script
npm run qa
```

The QA script will:
- Screenshot every section at **1440px** (desktop) and **390px** (mobile)
- Save all screenshots to `/screenshots`
- Log any layout overflow issues

## Design Tokens

- **Background:** `#0a0f1e` (deep navy)
- **Text:** White
- **Accent:** `#f59e0b` (gold/amber)
- **Glass effect:** Backdrop blur with subtle border

## Animations

- Hero text: staggered word-by-word entrance
- Scroll-triggered section reveals (fade up + scale)
- Book cover: 3D perspective tilt on hover
- Stats: animated counters
- Navigation: glassmorphism with blur backdrop
