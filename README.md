# Fun Factory

A nostalgic single-page React + Vite web app that recreates a retro CRT TV
experience: three channels (DIY, Preschool, Arcade), animated show pages with
real theme music, and three playable arcade games (Snake Xenzia, City Bloxx,
Block Puzzle).

## Tech stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS v4
- Framer Motion (animations)
- Lucide React (icons)
- Web Audio API (synth FX) + HTML Audio (real `.m4a` show themes)

## Run it locally in VS Code

### Prerequisites

- **Node.js 20 or newer** — <https://nodejs.org>
- **VS Code** — <https://code.visualstudio.com>
- A package manager (any of):
  - **npm** (ships with Node)
  - **pnpm** (`npm install -g pnpm`)
  - **yarn** (`npm install -g yarn`)

### Recommended VS Code extensions

- **ESLint** (Microsoft)
- **Tailwind CSS IntelliSense** (Tailwind Labs)
- **TypeScript and JavaScript Language Features** (built-in)

### Steps

1. Unzip the project somewhere convenient.
2. In VS Code: **File → Open Folder…** and pick the unzipped folder.
3. Open the integrated terminal: **Terminal → New Terminal** (or `` Ctrl+` ``).
4. Install dependencies:
   ```bash
   npm install
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```
6. Open the URL Vite prints (default <http://localhost:5173>).

### Other useful scripts

```bash
npm run build       # production build into ./dist
npm run preview     # preview the production build locally
npm run typecheck   # run TypeScript type checking
```

## Project structure

```
fun-factory/
├── index.html                     Vite HTML entry
├── package.json                   Dependencies + scripts
├── vite.config.ts                 Vite config
├── tsconfig.json                  TypeScript config
├── components.json                shadcn/ui config
├── public/
│   ├── favicon.svg
│   ├── opengraph.jpg
│   └── sounds/                    Real theme music (.m4a)
│       ├── diy/                   mad, art-attack, mister-maker, engineer-this
│       ├── preschool/             oswald, noddy, handy-manny, thomas, gali-gali, pingu
│       └── arcade/                snake, city-bloxx, block-puzzle
└── src/
    ├── main.tsx                   React entry
    ├── App.tsx                    Phase router (boot → landing → tv)
    ├── index.css                  Tailwind v4 theme + CRT/wood/Nokia styles
    ├── lib/
    │   ├── audioEngine.ts         Web Audio engine + real audio loader
    │   ├── shows.ts               All show + game data
    │   └── utils.ts               cn() helper
    ├── hooks/                     use-mobile, use-toast
    └── components/
        ├── Loader.tsx             TV power-on screen
        ├── Landing.tsx            "Press Start" splash
        ├── TvShell.tsx            TV chrome (bezel, knobs, channel buttons)
        ├── TvScreen.tsx           Channel switcher
        ├── ShowDetail.tsx         Animated show page (Theme/Memory/Fact/Games)
        ├── channels/
        │   ├── HomeChannel.tsx
        │   ├── DiyChannel.tsx
        │   ├── PreschoolChannel.tsx
        │   └── ArcadeChannel.tsx  Nokia 3310 menu
        ├── games/
        │   ├── Snake.tsx
        │   ├── CityBloxx.tsx
        │   └── BlockPuzzle.tsx
        └── ui/                    shadcn/ui components
```

## How the audio works

- Web Audio API powers all UI / FX sounds (clicks, static, boot tone,
  channel-flip, dice, jingles).
- HTML `<audio>` elements stream the real `.m4a` theme tracks from
  `public/sounds/`.

The engine has a small detail worth knowing:

- The **loader's boot buzz** only plays if you've already interacted with
  the page (refresh case, audio context already running). On a fresh tab,
  the browser blocks audio until the first user gesture, so the loader is
  silent and the boot tone fires the moment you click **Press Start**.
- The **show theme** (Play Theme button) starts the real `.m4a` track
  immediately. If the file is missing, blocked, or doesn't start within
  1.2 seconds, a synth jingle takes over so you're never left in silence.

To swap a theme track: drop a new `.m4a` file with the same name into the
matching folder under `public/sounds/`. To use a different file format,
update the path in `src/lib/shows.ts`.

## Adding images for preschool shows

1. Drop image files into `public/images/preschool/` (one per show, named
   after the show id, e.g. `pingu.png`).
2. Add an `image` field to the `Show` interface and to each preschool show in
   `src/lib/shows.ts`:
   ```ts
   image: "/images/preschool/pingu.png",
   ```
3. Render `<img src={s.image} ... />` in
   `src/components/channels/PreschoolChannel.tsx` and/or
   `src/components/ShowDetail.tsx`.

---

## Push this project to GitHub

### Prerequisites

- A free GitHub account: <https://github.com>
- **Git** installed locally — <https://git-scm.com/downloads>

### Step 1 — Create an empty repo on GitHub

1. Go to <https://github.com/new>.
2. Repository name: `fun-factory` (or anything you like).
3. Leave it **empty** — do not add a README, .gitignore, or license,
   since this project already has them.
4. Click **Create repository**.
5. Copy the repo URL shown next (looks like
   `https://github.com/<your-username>/fun-factory.git`).

### Step 2 — Push your local code

In the VS Code terminal, from inside the unzipped project folder:

```bash
git init
git add .
git commit -m "Initial commit: Fun Factory"
git branch -M main
git remote add origin https://github.com/<your-username>/fun-factory.git
git push -u origin main
```

The first push will ask you to authenticate. The easiest way: install the
**GitHub Pull Requests and Issues** extension in VS Code and sign in. Or
use a personal access token (<https://github.com/settings/tokens>).

Refresh the GitHub page — your code should be there.

### Step 3 (optional) — Deploy it for free

The built `dist/` folder is plain static files, so any static host works:

- **Vercel** — <https://vercel.com> — import the GitHub repo, leave
  defaults, click Deploy.
- **Netlify** — <https://netlify.com> — same flow.
- **GitHub Pages** — run `npm run build` then push `dist/` using a
  GitHub Pages action.

## Notes about the bundled music

The `.m4a` files in `public/sounds/` are real recordings of the original
show themes, included for personal / nostalgic use. If you plan to publish
this app publicly, please confirm the licensing of any audio you ship.

## License

Personal / educational project. Show ideas, characters, and theme music
belong to their respective owners; this is a nostalgic homage, not
affiliated with any broadcaster.
