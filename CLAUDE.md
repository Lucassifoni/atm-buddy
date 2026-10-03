# ATM Buddy Technical Guide

## Project Purpose

Mobile-friendly web application for Amateur Telescope Makers (ATMs) providing specialized calculators and reference tools. Live at https://atm-buddy.app, installable via the web manifest, works offline after the first load.

## Technical Stack

- Vue 3, Options API, no build-time TypeScript
- Vue Router 4, routes pre-rendered to static pages by vite-ssg
- Vite 7 + `@vitejs/plugin-vue`
- Tailwind CSS 3 with daisyUI 4 (PostCSS + autoprefixer, no SASS)
- Vitest for the formula and utility tests
- Prettier for formatting (`yarn format`)

## Architecture

- Entry point `src/main.js`: re-exports the route table from `src/routes.js` and exports the `ViteSSG` app factory, registers `$t` / `$i18n` as global properties, and registers the service worker on the client.
- `src/App.vue` holds the layout, the language selector, and the analytics opt-out.
- Components are flat `.vue` files directly under `src/`, one per tool. Views live at the top level of the route table; smaller tools are nested under the `/little_calculators` parent route rendered by `LittleCalculators.vue`.
- All calculations run client-side. Every route is pre-rendered at build time, so component code must tolerate running without `window` (see `isBrowser` guards in `src/utils.js`).

## Where things live

- `src/formulas.js` — every piece of optics math, as pure functions taking a single named-argument object. Related functions are grouped in a plain object (`pressure`, `foucault`, `mirrorBlank`, `spherometerTriangle`, …). Impossible inputs return `NaN`; components decide how to display that.
- `src/formulas.test.js` — Vitest coverage for the above. Any new formula is expected to come with tests, including its degenerate cases.
- `src/utils.js` / `src/utils.test.js` — `get`/`set` localStorage helpers, `normalize`/`parseFloat` (accept a decimal comma, French keyboards), and the hardware getters.
- `src/useI18n.js` + `src/strings.en.js` + `src/strings.fr.js` — i18n. `$t("section.key")` in templates; English is the fallback language. Every user-facing string goes in both files, route titles under `routes.*`. (`src/lang.js` is leftover dead code from an earlier iteration.)
- `src/components/Icon.vue`, `src/assets/icons.svg`, `src/assets/iconMap.js` — icons come from a single 24×24 sprite grid; `iconMap.js` maps an icon name to its `[column, row]`. Each route has its own icon. A cell whose icon is not drawn yet holds a dashed, labelled group in the `Placeholders` layer of `icons.svg` (`<g id="icon_name">`), to be deleted once the drawing lands in that cell. `icon_map.svg` is the labelled reference of the whole grid; `src/assets/iconMap.test.js` keeps routes, map, placeholders and reference in sync.
- `public/` — service worker, manifest, favicon.

## Persistence

- Per-tool form state: one localStorage key per component, named `__snake_case`, written through `set(this, STORAGE_KEY, snapshot, key, value)` and read with `get(STORAGE_KEY, key, default)`.
- Saved gear: `__hardware`, holding `spherometers`, `opticalPieces` and `polishers`, managed by `Hardware.vue` and exposed through `getHardware()` and friends. `SpherometerSelector.vue`, `OpticalPieceSelector.vue` and `PolisherSelector.vue` emit a selection so a calculator can prefill its inputs.

## Adding a calculator

1. Add the math to `src/formulas.js` as pure functions, and tests to `src/formulas.test.js`.
2. Create `src/YourTool.vue` — result first in an `alert alert-success`, then the inputs as `field-horizontal` rows with `inputmode="decimal"` and a comma-tolerant `pattern`.
3. Register the route in `src/routes.js` (nest it under `littleCalculators` unless it is a headline tool, which also needs `isHome: true`) with an `icon` and a `titleKey`. Give it a free cell in `iconMap.js`, a placeholder in `icons.svg` and a label in `icon_map.svg`.
4. Add the strings to both `strings.en.js` and `strings.fr.js`, including the `routes.*` title.
5. Run `yarn test:run`, then `yarn build`.

## Build and deploy

- `yarn dev` — dev server.
- `yarn test` — Vitest in watch mode, `yarn test:run` for a single run.
- `yarn build` — runs `vitest run` first, then `vite-ssg build` into `dist/` (one pre-rendered `index.html` per route).
- CI (`.github/workflows`) tests and builds on every push and PR to `main`, and deploys `dist/` to GitHub Pages on `main`.
