# Moving Again Website (Astro)

This repository contains the source code for the new **Moving Again** website,
built with [Astro](https://astro.build) and
[Tailwind CSS](https://tailwindcss.com). This project is intended to replace the
existing WordPress implementation with a high-performance, static-first
architecture.

## 🛠️ Tech Stack

- **Framework**: [Astro 5](https://astro.build)
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Language**: TypeScript
- **Linting/Formatting**: ESLint, Prettier

## 🎨 Design System

The project uses a custom Tailwind configuration to match the Moving Again brand
identity.

### Colors

Use these utility classes for branding:

| Color Name       | Hex       | Usage                       | Class Example                      |
| ---------------- | --------- | --------------------------- | ---------------------------------- |
| **Brand Red**    | `#800006` | Primary CTA, Headers        | `bg-brand-red`, `text-brand-red`   |
| **Brand Yellow** | `#F1C40D` | Secondary CTA, Highlights   | `bg-brand-yellow`                  |
| **Brand Accent** | `#B23850` | Logo Accent                 | `text-brand-accent`                |
| **Brand Dark**   | `#191919` | Main Text, Dark Backgrounds | `text-brand-dark`, `bg-brand-dark` |
| **Brand Light**  | `#FAFAFA` | Page Backgrounds            | `bg-brand-light`                   |
| **Brand Gray**   | `#333333` | Borders, Footer Backgrounds | `border-brand-gray`                |

### Fonts

- **Primary Font**: `Roboto` (Google Fonts). configured as the default
  sans-serif font.

### UI Tokens

- **Border Radius**: `rounded-brand` (20px) - used for buttons and cards.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development

Start the local development server:

```bash
npm run dev
```

Visit `http://localhost:4321` to see the site.

### Build

Build the project for production:

```bash
npm run build
```

The output will be in the `dist/` directory.

### Linting & Formatting

Ensure code quality before committing:

```bash
npm run lint      # Check for linting errors
npm run lint:fix  # Automatically fix linting errors
npm run format    # Format code with Prettier
```

## 📂 Project Structure

```text
/
├── src/
│   ├── components/    # Reusable UI components (SEO, Connectors, UI elements)
│   ├── layouts/       # (Optional) Page layouts
│   ├── pages/         # File-based routing (index.astro, etc.)
│   └── styles/        # Global styles (if any)
├── public/            # Static assets (fonts, images, robots.txt)
├── astro.config.mjs   # Astro configuration
└── tailwind.config.mjs # Tailwind configuration (Design tokens)
```

## 🧩 Key Components

- **`SEO.astro`**: Wraps pages to handle meta tags, Open Graph, and titles.
  **Must be used on every page.**
- **`Analytics.astro`**: Handles Google Analytics/Tag Manager injection.
- **`Schema.astro`**: Generates JSON-LD structured data for SEO.

## 🤝 Best Practices

1. **Use Tailwind Utility Classes**: Avoid writing custom CSS in `<style>`
   blocks unless absolutely necessary. Use the `brand-*` colors.
2. **Type Safety**: Use TypeScript interfaces for Component Props.
3. **SEO First**: Ensure every page uses the `<SEO />` component and includes
   unique titles/descriptions.
4. **Images**: Use Astro's built-in `<Image />` component for optimized assets
   where possible (or place in `public/` if generic).
