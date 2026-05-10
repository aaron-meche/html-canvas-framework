import {
    StateStore,
    Wrapper
} from "$lib"
import {
    ButtonRow,
    CodeBlock,
    CounterPanel,
    FeatureGrid,
    Heading,
    InstallCommand,
    Lead,
    PageMain,
    PrimaryLink
} from "$lib/components.js"

export const title = "Ginger UI"

const counter = new StateStore({
    count: 0
})

function HeroIntro({ link }) {
    return new Wrapper([
        Heading("Class-based interfaces for plain JavaScript"),
        Lead("Ginger UI turns small JavaScript classes into browser interfaces. Compose UIElement subclasses, mount them with new Interface(), and use a Vite-powered routes directory for app pages.", {
            margin_top: "1.25rem",
            max_width: "42rem"
        }),
        ButtonRow([
            PrimaryLink("Read about routing", "/about", link),
            InstallCommand("npm install @aaron-meche/ginger-ui")
        ])
    ])
}

function Hero({ link }) {
    return new Wrapper([
        HeroIntro({ link }),
        CounterPanel(counter)
    ], {
        className: "hero-grid",
        display: "grid",
        gap: "2rem",
        align_items: "center",
        grid_template_columns: "minmax(0, 1.35fr) minmax(18rem, 0.65fr)"
    })
}

function Features() {
    return FeatureGrid([
        {
            title: "Importable package",
            description: "The root package exports Interface, UIElement, Button, Image, StateStore, and router helpers through a normal npm entry."
        },
        {
            title: "File-system routes",
            description: "Each src/routes/**/+index.js file maps to the matching browser path, including src/routes/+index.js for /."
        },
        {
            title: "Shared layouts",
            description: "A src/routes/+layout.js file wraps matching routes without changing the Interface implementation."
        }
    ])
}

function PackageExample() {
    return CodeBlock(`import { Interface, Wrapper } from "@aaron-meche/ginger-ui"

new Interface({
    app: [
        new Wrapper("Hello Ginger UI", {
            padding: "2rem",
            font_size: "2rem"
        })
    ]
})`)
}

export default function HomePage({ link }) {
    return PageMain([
        Hero({ link }),
        Features(),
        PackageExample()
    ])
}
