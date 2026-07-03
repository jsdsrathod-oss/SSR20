# Sahitya's 20th Birthday Interactive Website ✨

A luxury, Awwwards-caliber digital experience built for Sahitya's 20th Birthday, customized as a gift from Jay. The site features smooth scroll-triggered animations (via GSAP), dynamic color morphing between chapters, an interactive custom cursor, an interactive Spin-the-Wheel Coupon Game, a hidden love letter envelope, a friendship-o-meter rating, and a grand finale celebration button.

---

## 🚀 Quick Start (Local Preview)

To run the website on your local machine:

1. Open your terminal.
2. Navigate to the project directory:
   ```bash
   cd /Users/JSR/SSR/antigrav
   ```
3. Start a local Python server:
   ```bash
   python3 -m http.server 8000
   ```
4. Open your browser and go to: **`http://localhost:8000`**

---

## 🎨 How to Customize the Content

You can easily replace the template details with your actual memories and images by editing the codebase files:

### 1. Replacing Text (Names, Milestones, Coupons)
Open [index.html](file:///Users/JSR/SSR/antigrav/index.html) in your editor and modify these sections:
- **Names**: Search for `Sahitya` and `Jay` to replace them with your actual names.
- **Milestones**: Edit the date, title, and descriptions under `<section id="timeline">` in `index.html`.
- **Coupon Slices**: Update the titles and descriptions of the spin wheel items in [app.js:L245-L252](file:///Users/JSR/SSR/antigrav/app.js#L245-L252).
- **Love Letter**: Customize the message inside the `<div class="letter-sheet">` container in `index.html`.

### 2. Replacing Photos
The site references media assets in the `assets/` directory (extracted from your docx file). Swap them out with your real photos by placing your files in `/Users/JSR/SSR/antigrav/assets/` using the exact same filenames:
- **`hero_bg.jpg`** (Aspect ratio: 16:9) — Used as the high-impact hero backdrop.
- **`milestone1.jpeg`** (Aspect ratio: 4:3) — Used in Milestone 1 ("The Jacket That Had To Be Praised").
- **`milestone2.jpeg`** (Aspect ratio: 4:3) — Used in Milestone 2 ("The Queen's Coronation").
- **`milestone3.jpeg`** (Aspect ratio: 4:3) — Used in Milestone 3 ("Upscaling The Game").
- **`milestone4.jpg`** (Aspect ratio: 4:3) — Used in Milestone 4 ("The Best Day On Earth").
- **`gallery_5.jpg` through `gallery_26.jpeg`** — Swapped dynamically into the gallery masonry grid. The grid automatically shuffles and jumbles the order of these images on every page refresh!

*Tip: For best visual performance, ensure your replacement images are compressed/resized to stay under 1MB each.*

---

## 🛠️ Stack & Libraries (No Setup Required)

This is a dependency-light, pure frontend project loading resources via secure CDNs. You do not need `npm install` or any complex tooling:
- **Animations**: [GSAP 3.12.5](https://greensock.com/gsap/), [ScrollTrigger](https://greensock.com/scrolltrigger/) & [ScrollToPlugin](https://greensock.com/scrolltoplugin/) (used to reset scroll to top on Replay)
- **Celebration Confetti**: [canvas-confetti](https://github.com/catdad/canvas-confetti)
- **Icons**: [FontAwesome 6.4.0](https://fontawesome.com/)
- **Fonts**: Google Fonts (`Playfair Display` + `Plus Jakarta Sans`)
