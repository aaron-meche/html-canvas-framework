import {
    Button,
    Wrapper
} from "$lib"
import {
    CodeBlock,
    Heading,
    InfoPanel,
    Lead,
    PageMain
} from "$lib/components.js"
import { primaryButtonStyle } from "$lib/theme.js"

export const title = "About Ginger UI"

function SetupNotes() {
    return InfoPanel([
        {
            title: "$lib alias",
            description: "Vite resolves $lib to src/lib, so route files can import framework utilities and shared components without long relative paths."
        },
        {
            title: "Layout route",
            description: "src/routes/+layout.js exports the shared shell that wraps /, /about, and future nested pages."
        },
        {
            title: "Page routes",
            description: "src/routes/+index.js maps to /, while src/routes/about/+index.js maps to /about."
        },
        {
            title: "Package build",
            description: "vite.config.js builds the package from index.js into dist/ginger-ui.js and dist/ginger-ui.umd.cjs."
        }
    ])
}

function RouterExample() {
    return CodeBlock(`import { createRouter } from "$lib"
import "./static/main.css"

const routes = import.meta.glob("./routes/**/+index.js")
const layouts = import.meta.glob("./routes/**/+layout.js")

createRouter(routes, {
    layouts,
    target: "#app",
    title: "Ginger UI"
}).start()`)
}

function BackButton(navigate) {
    return new Wrapper([
        new Button("Go home", {
            ...primaryButtonStyle,
            onclick: () => navigate("/")
        })
    ], {
        margin_top: "1.5rem"
    })
}

export default function AboutPage({ navigate }) {
    return PageMain([
        Heading("About the setup", {
            font_size: "clamp(2.2rem, 5vw, 4rem)",
            line_height: "1"
        }),
        Lead("Ginger UI now has a SvelteKit-inspired source layout: src/lib for reusable source, src/routes for routed pages, and src/static for demo assets."),
        SetupNotes(),
        RouterExample(),
        BackButton(navigate)
    ], {
        max_width: "920px",
        padding: "4rem min(6vw, 4rem)"
    })
}
