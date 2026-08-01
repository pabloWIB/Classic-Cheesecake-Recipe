# Classic-Cheesecake-Recipe

Single recipe page with a tickable ingredient list, built so it survives being read one-handed in a kitchen.

[![Live demo](https://img.shields.io/badge/demo-cheesecakerecipe.wib.digital-2ea44f)](https://cheesecakerecipe.wib.digital)
[![Hire me on Fiverr](https://img.shields.io/badge/Hire%20me%20on-Fiverr-1DBF73?style=for-the-badge&logo=fiverr&logoColor=white)](https://www.fiverr.com/pablonietop)
![Dependencies](https://img.shields.io/badge/npm%20dependencies-0-brightgreen)
![Build step](https://img.shields.io/badge/build%20step-none-lightgrey)
![Page weight](https://img.shields.io/badge/first%20load-63%20KB-brightgreen)

## Description

Recipe sites bury the recipe. The thing a cook actually needs — what to buy, how long it takes, what to do next — sits below a personal essay and a stack of ads. This page carries one recipe and starts with the ingredients.

Ingredients are checkboxes, not bullets. Ticking one off as it goes in the bowl is the only state a cook needs while their hands are busy, and it is the one thing a printed list cannot do. Ten items, each independently tickable, and the list survives a reload — a phone screen locks itself halfway through a bake.

The timing block is stated up front as yield, prep time, cook time and total time, so the decision to start can be made before reading the method. On a wide screen it stays pinned while the instructions scroll past. The recipe itself is credited to Sally's Baking Addiction, linked in the page.

## Features

- Ten ingredients as individually tickable checkboxes, remembered across reloads via `localStorage`.
- A reset button to clear the list for the next bake, disabled while nothing is ticked.
- Yield, prep time, cook time and total time stated before the method, and pinned to the viewport on wide screens.
- Light and dark themes. Follows the operating system until you choose, then remembers the choice.
- Method split into seven numbered steps.
- Fully keyboard operable, with a skip link, visible focus rings and 44 px touch targets.
- Source recipe credited and linked.
- No build step, no package manager and no runtime dependencies.

## Tech stack

| Layer | Technology | Role in project |
|---|---|---|
| Markup | HTML5 | `index.html` and `404.html` |
| Styling | CSS3 custom properties, grid, flexbox | Three cascade-ordered stylesheets |
| Scripting | Vanilla JavaScript (ES5 syntax, IIFE) | Theme toggle and checklist persistence |
| Fonts | Montserrat, Playfair Display | Served by Google Fonts with `preconnect` |
| Images | WebP with `srcset` | One photograph; every icon is inline SVG |

## Prerequisites

None. Open `index.html` in any browser.

## Installation

```bash
git clone https://github.com/pabloWIB/Classic-Cheesecake-Recipe.git
cd Classic-Cheesecake-Recipe
```

Open `index.html` directly, or serve the folder to exercise `404.html`:

```bash
npx serve .
```

## Project structure

```
.
├── index.html                        # The full recipe
├── 404.html                          # Not-found page, links back to the recipe
├── robots.txt
├── sitemap.xml
├── assets/
│   ├── css/
│   │   ├── base.css                  # Tokens, reset, base typography, print
│   │   ├── layout.css                # Container, header, recipe grid, footer
│   │   └── components.css            # Theme toggle, checklist, meta card, steps
│   ├── js/
│   │   └── main.js                   # Single entry point, no dependencies
│   └── img/
│       ├── content/
│       │   ├── cheesecake-slice.webp      # 1920w hero
│       │   └── cheesecake-slice-960.webp  # 960w hero for narrow screens
│       └── icons/
│           └── favicon.svg
└── docs/
    ├── auditoria.md                  # State of the project before the rewrite
    └── cambios.md                    # What changed, by phase
```

Stylesheets load in cascade order: `base` → `layout` → `components`. The icons are not files — they are inline SVG in the markup, so they inherit the current theme colour.

## Usage

Ticking an ingredient stores its id under the `cheesecake:checked` key in `localStorage`; the theme choice is stored under `cheesecake:theme`. Both reads and writes are wrapped in `try/catch`, so the page still works where storage is blocked — it just stops remembering.

`main.js` is a single classic script loaded with `defer`, not an ES module. Browsers block module imports over `file://` on CORS grounds, and this page has to work when `index.html` is opened straight off the filesystem.

## Credits

The recipe is from [Sally's Baking Addiction](https://sallysbakingaddiction.com), linked in the page. This repository is the presentation layer, not the recipe's source.

## Deployment

Deployed on Vercel at [cheesecakerecipe.wib.digital](https://cheesecakerecipe.wib.digital). Static: upload the repository root as-is, no build command and no output directory.

## Author

**Pablo Nieto Pérez** — [wib.digital](https://wib.digital)
GitHub: [@pabloWIB](https://github.com/pabloWIB)

## Hire me

I build **custom internal tools, CRMs and dashboards** for small teams, and
**conversion-focused websites** for businesses.

- [Custom internal tool, CRM or dashboard](https://www.fiverr.com/pablonietop/build-a-custom-internal-app-for-your-business) — from $45
- [Conversion-focused website](https://www.fiverr.com/pablonietop/convert-your-landing-page-design-to-code) — from $80
- [All my services on Fiverr](https://www.fiverr.com/pablonietop)
- [wib.digital](https://wib.digital)
