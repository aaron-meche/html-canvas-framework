# Ginger UI

Ginger UI is a small class-based JavaScript UI framework. Interfaces are built
from `UIElement` classes, mounted with `new Interface()`, and can be organized
into Vite-powered route files.

The package is named after Ginger. Once it is published, install it as:

```bash
npm install @aaron-meche/ginger-ui
```

## What This Repo Contains

```text
.
├── index.html              # Vite demo shell
├── index.js                # npm package entry
├── script.js               # demo bootstrap and route discovery
├── vite.config.js          # library build config
├── vite.demo.config.js     # demo site build config
├── js/
│   ├── index.js            # public framework exports
│   ├── interface.js        # Interface, UIElement, elements, StateStore
│   └── router.js           # file route helper
└── routes/
    ├── +index.js           # /
    └── about/
        └── +index.js       # /about
```

## Install And Run

```bash
npm install
npm run dev
```

The local Vite app runs the demo from `index.html`.

Build the npm library:

```bash
npm run build
```

Build the demo site:

```bash
npm run build:demo
```

Run both checks:

```bash
npm run check
```

## Importing Ginger UI

After publishing or linking the package, use:

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

During local development inside this repo, the demo imports from source:

```js
import { createRouter } from "./js/index.js"
```

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

`Interface` accepts an object with `app`, `body`, or `main`. The value should be
an array of strings or UI elements. You can also pass a mount target:

```js
new Interface({ app: elements }, { target: "#app" })
```

## UIElement

`UIElement` is the base class. It renders a `div` unless you provide another
`tag`.

```js
new UIElement({
    tag: "section",
    display: "grid",
    gap: "1rem",
    padding: "2rem",
    background: "black",
    color: "white",
    content: [
        new Wrapper("Title", {
            font_size: "2rem",
            font_weight: 800
        }),
        "Plain text works too."
    ]
})
```

Most config keys become inline CSS. Use snake case for CSS properties:

```js
{
    font_size: "1rem",
    border_radius: "8px",
    align_items: "center"
}
```

Common HTML attributes are supported directly:

```js
new UIElement({
    tag: "a",
    href: "https://example.com",
    target: "_blank",
    rel: "noreferrer",
    content: "Example"
})
```

For custom attributes, use `attributes`, `attrs`, `data`, or `aria`:

```js
new Wrapper("Save", {
    role: "button",
    data: { action: "save" },
    aria: { label: "Save document" }
})
```

## Built-In Elements

```js
new Wrapper("Content", { padding: "1rem" })

new Button("Click", {
    onclick: elem => {
        elem.innerText = "Clicked"
    }
})

new Image("/avatar.png", {
    alt: "Avatar",
    height: "2rem",
    border_radius: "100vh"
})

new HStack([left, right], {
    gap: "1rem"
})

new VStack([top, bottom], {
    gap: "1rem"
})
```

## Events

Use `onclick` and `onhover` in element config:

```js
new Button("Hover me", {
    padding: "0.75rem 1rem",
    cursor: "pointer",
    onhover: elem => {
        elem.style.background = "orange"
    },
    onclick: () => {
        alert("Clicked")
    }
})
```

Handlers receive the real DOM element. Hover styles are restored on mouse leave.

## State

`StateStore` is a tiny state container. Any element whose `content` is a function
becomes a live region.

```js
const counter = new StateStore({ count: 0 })

new Wrapper([
    new Wrapper(() => `Count: ${counter.get("count")}`),
    new Button("Increment", {
        onclick: () => {
            counter.set("count", counter.get("count") + 1)
        }
    })
])
```

Calling `set()` or `update()` refreshes all live regions.

## Routes Directory

The demo uses a Svelte-like route convention:

```text
routes/+index.js          -> /
routes/about/+index.js    -> /about
routes/docs/+index.js     -> /docs
```

Each route exports a default page function or value:

```js
import { Wrapper } from "../js/index.js"

export const title = "Home"

export default function HomePage({ link, navigate, path }) {
    return [
        new Wrapper([
            "Welcome home",
            link("About", "/about")
        ])
    ]
}
```

`script.js` wires the route folder to the router:

```js
import { createRouter } from "./js/index.js"

const routes = import.meta.glob("./routes/**/+index.js")

createRouter(routes, {
    target: "#app",
    title: "Ginger UI"
}).start()
```

`import.meta.glob` is a Vite feature, so route discovery is handled at build
time by Vite.

## Package Build

The npm build is controlled by `vite.config.js`:

```js
export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "index.js"),
            name: "GingerUI",
            formats: ["es", "umd"],
            fileName: format => format === "es"
                ? "ginger-ui.js"
                : "ginger-ui.umd.cjs"
        }
    }
})
```

`npm run build` creates:

```text
dist/ginger-ui.js
dist/ginger-ui.umd.cjs
```

Those files are the package entry points configured in `package.json`.
