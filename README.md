# 🍅 Code-Tomato Portfolio

A modern, bold, and colorful portfolio website built with [Astro](https://astro.build/) featuring warm gradients, smooth animations, and a focus on performance.

## 🌐 Live Site

Visit the live portfolio at: **[code-tomato.github.io](https://code-tomato.github.io)**

## ✨ Features

- 🎨 **Bold Design**: Vibrant warm color palette (orange, red, yellow gradients)
- 🌓 **Dark/Light Mode**: Smooth theme toggle with localStorage persistence
- 🎬 **Animations**: Scroll-triggered reveal animations and typing effects
- 📱 **Responsive**: Mobile-first design that looks great on all devices
- ⚡ **Performance**: Lightning-fast load times with Astro's static generation
- ♿ **Accessible**: ARIA labels, semantic HTML, and keyboard navigation
- 📧 **Contact Form**: Animated form with validation
- 🎯 **Bento Grid**: Trendy asymmetric project showcase layout
- 🚀 **Interactive Hero**: Floating cards and animated gradient backgrounds

## 🛠️ Tech Stack

- **Framework**: Astro
- **Styling**: Custom CSS with CSS Variables
- **Animations**: CSS animations + Intersection Observer API
- **Deployment**: GitHub Pages
- **Language**: TypeScript

## 🎨 Design System

### Color Palette
- Primary: `#ff6b35` (Orange)
- Secondary: `#f7931e` (Amber)
- Accent: `#ffd23f` (Yellow)

### Key Components
- Animated hero section with typing effect
- Sticky header with blur effect
- Gradient-bordered cards
- Progress bars with animations
- Mobile hamburger menu
- Newsletter subscription form

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The site will be available at `http://localhost:4321`

## 📂 Project Structure

```
/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable components
│   │   ├── Header.astro
│   │   ├── ThemeToggle.astro
│   │   └── ContactForm.astro
│   ├── layouts/         # Page layouts
│   │   └── BaseLayout.astro
│   ├── pages/           # Routes
│   │   ├── index.astro
│   │   ├── about.astro
│   │   └── projects.astro
│   └── styles/          # Global styles
│       └── global.css
└── package.json
```

## 🎯 Pages

- **Home** (`/`) - Hero section, featured projects, contact form
- **About** (`/about`) - Skills with progress bars, services
- **Projects** (`/projects`) - Bento grid layout with project cards

## 🌟 Customization

### Updating Colors
Edit CSS variables in `src/styles/global.css`:

```css
:root {
  --color-primary: #ff6b35;
  --color-secondary: #f7931e;
  --color-accent: #ffd23f;
}
```

### Adding Projects
Edit the `projects` array in `src/pages/projects.astro`

## 📝 License

MIT License - feel free to use this template for your own portfolio!