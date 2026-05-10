# Ginger UI

Ginger UI is a small class-based JavaScript UI framework. Interfaces are built
from `UIElement` classes, mounted with `new Interface()`, and demonstrated with a
Vite route layer inspired by SvelteKit.

Once published, install it as:

```bash
npm install @aaron-meche/ginger-ui
```

## Project Structure

```text
.
├── index.html
├── index.js
├── package.json
├── vite.config.js
├── vite.demo.config.js
└── src/
    ├── main.js
    ├── lib/
    │   ├── index.js
    │   ├── interface.js
    │   ├── router.js
    │   ├── components.js
    │   └── theme.js
    ├── routes/
    │   ├── +layout.js
    │   ├── +index.js
    │   └── about/
    │       └── +index.js
    └── static/
        ├── main.css
        └── Figtree/
```

`src/lib/interface.js` is the core framework implementation. The route/layout
system is built around it in `src/lib/router.js`; the layout support does not
change the `Interface` class.

## Scripts

```bash
npm install
npm run dev
npm run check
```

Build the package:

```bash
npm run build
```

Build the demo app:

```bash
npm run build:demo
```

## Package Imports

```js
import {
    Interface,
    UIElement,
    Wrapper,
    Button,
    Image,
    HStack,
    VStack,
    StateStore,
    createRouter
} from "@aaron-meche/ginger-ui"
```

Inside this Vite project, `$lib` points to `src/lib`:

```js
import { Wrapper } from "$lib"
import { CodeBlock } from "$lib/components.js"
```

The alias is configured in `vite.config.js`, `vite.demo.config.js`, and
`jsconfig.json`.

## Basic Interface

```js
import { Interface, Wrapper } from "@aaron-meche/ginger-ui"

new Interface({
    app: [
        new Wrapper("Hello Ginger UI", {
            padding: "2rem",
            font_size: "2rem"
        })
    ]
})
```

Most element config keys become inline CSS. Use snake case for CSS properties:

```js
new Wrapper("Save", {
    font_size: "1rem",
    border_radius: "8px",
    align_items: "center"
})
```

## Routes

Routes live in `src/routes`. A `+index.js` file is the landing page for that
folder path:

```text
src/routes/+index.js          -> /
src/routes/about/+index.js    -> /about
src/routes/docs/+index.js     -> /docs
```

Each page exports a default function or value:

```js
import { Wrapper } from "$lib"

export const title = "Home"

export default function HomePage({ link }) {
    return new Wrapper([
        "Welcome home",
        link("About", "/about")
    ])
}
```

## Layouts

Layouts use `+layout.js`, similar to SvelteKit. The root layout wraps every
route below `src/routes`:

```js
import { AppShell } from "$lib/components.js"

export default function Layout({ children, link }) {
    return AppShell(children, { link })
}
```

Nested layouts are supported by folder path. For example,
`src/routes/docs/+layout.js` would wrap `src/routes/docs/+index.js` and deeper
docs routes.

## Router Setup

`src/main.js` wires Vite route modules to the router:

```js
import { createRouter } from "$lib"
import "./static/main.css"

const routes = import.meta.glob("./routes/**/+index.js")
const layouts = import.meta.glob("./routes/**/+layout.js")

createRouter(routes, {
    layouts,
    target: "#app",
    title: "Ginger UI"
}).start()
```

`import.meta.glob` is a Vite feature, so route discovery happens through Vite at
dev/build time.

## Package Build

The package entry is `index.js`, which re-exports `src/lib/index.js`.

`npm run build` creates:

```text
dist/ginger-ui.js
dist/ginger-ui.umd.cjs
```

Those files are the import and require entry points configured in
`package.json`.

