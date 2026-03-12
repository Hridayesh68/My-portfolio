# 🚀 Hridayesh Debsarma — Personal Portfolio

A modern, animated developer portfolio built with **React**, **GSAP**, and **Three.js** — featuring scroll-driven animations, a horizontal project showcase, an interactive experience timeline, and a full tech stack section.

---

## ✨ Features

- **Scroll-driven animations** — GSAP ScrollTrigger powers every section reveal, stagger, and parallax effect
- **Experience Timeline** — Dual-column layout with an RGB progress line, milestone cards, and specialisation cards
- **Projects Showcase** — Horizontal scroll with image-first cards; hovering reveals description, tags, and links
- **Tech Arsenal** — Icon grid with per-category entrance animations (slide, scale, flip, bounce)
- **Soft Skills** — Icon grid matching the tech stack aesthetic with tooltip-on-hover labels
- **Dark / Light mode** — Full Tailwind dark mode support across all sections
- **Responsive** — Mobile-first layout, adapts cleanly across all screen sizes

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | GSAP + ScrollTrigger |
| 3D / WebGL | Three.js |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Experience.jsx       # Timeline with milestones & specialisations
│   ├── Projects.jsx         # Horizontal scroll project cards
│   ├── TechStack.jsx        # Tech arsenal + soft skills + platforms
│   └── ui/
│       └── Card.jsx         # Reusable glass card component
├── assets/
│   └── projects/            # Project preview images
├── public/
│   ├── tech-stack/          # SVG tech icons
│   ├── platforms/           # Coding platform icons
│   └── pngs/                # PNG fallback icons
├── App.jsx
└── main.jsx
```

---

## 🏃 Getting Started

### Prerequisites

- Node.js `v18+`
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Hridayesh68/<your-repo-name>.git

# Navigate into the project
cd <your-repo-name>

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build
```

### Preview Build

```bash
npm run preview
```

---

## 🗂️ Sections

### Experience & Tech Stack
A dual-column scroll timeline featuring:
- **Right column** — Career milestones (2023 → Present) including CS Foundations, Summer Training at LPU, Data Analytics & Models, Backend Engineering, Advanced Frontend & WebGL, and Full Stack Architecture
- **Left column** — Specialisation cards for Game Development (Unity/C#), 3D Modelling (Blender), and Data Analytics (Power BI)
- RGB animated progress line that fills as you scroll

### Projects
Horizontal scrollable cards with:
- Full image visible by default
- Hover reveals description, tags, GitHub link, and Live Demo button
- Projects: EV Analysis Dashboard, Placement Prediction, Resume Analyzer

### Tech Arsenal
- **Frameworks & Libraries** — React, Three.js, Flutter, PyTorch, Unity, Unreal Engine, Vite
- **Tools & Platforms** — Android Studio, Blender, Docker, Firebase, Vercel
- **Operating Systems** — Linux, Ubuntu
- **Languages & Databases** — JavaScript, Python, C++, C#, Dart, HTML5, CSS3, MongoDB, MySQL, Android
- **Soft Skills** — Icon grid with hover tooltips

---

## 📊 Stats

| Metric | Value |
|---|---|
| Problems Solved | 200+ |
| HackerRank Rating | ⭐⭐⭐⭐⭐ |
| Projects Shipped | 6+ |
| Certifications | 3+ |

---

## 🌐 Live Demo

[https://hridayesh-portfolio.vercel.app](https://hridayesh-portfolio.vercel.app)

---

## 📬 Contact

- **LinkedIn** — [hridayesh-debsarma](https://www.linkedin.com/in/hridayesh-debsarma/)
- **LeetCode** — [hridayeshdebsarma6](https://leetcode.com/u/hridayeshdebsarma6/)
- **GitHub** — [Hridayesh68](https://github.com/Hridayesh68)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
