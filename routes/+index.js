//
// Root / Path
//

import {
    Button,
    HStack,
    StateStore,
    UIElement,
    Wrapper,
    classes
} from "../js/index.js"

export const title = "Ginger UI"

const counter = new StateStore({
    count: 0
})

const colors = {
    page: "hsl(28, 26%, 96%)",
    text: "hsl(230, 22%, 12%)",
    muted: "hsl(232, 10%, 42%)",
    border: "hsl(28, 18%, 82%)",
    panel: "hsl(0, 0%, 100%)",
    accent: "hsl(17, 83%, 52%)",
    accentDark: "hsl(17, 72%, 34%)",
    code: "hsl(220, 24%, 14%)"
}

const navButtonStyle = {
    color: colors.text,
    font_size: "0.9rem",
    font_weight: 700,
    padding: "0.6rem 0.85rem",
    border_radius: "0.45rem",
    cursor: "pointer",
    onhover: elem => {
        elem.style.background = "hsla(17, 83%, 52%, 0.12)"
    }
}

function PageShell(children, { link }) {
    return new UIElement({
        min_height: "100vh",
        background: colors.page,
        color: colors.text,
        content: [
            new UIElement({
                tag: "nav",
                display: "flex",
                justify_content: "space-between",
                align_items: "center",
                padding: "1.1rem min(6vw, 4rem)",
                border_bottom: `1px solid ${colors.border}`,
                content: [
                    new Wrapper("Ginger UI", {
                        font_size: "1.05rem",
                        font_weight: 900,
                        color: colors.accentDark
                    }),
                    new Wrapper([
                        link("Home", "/", navButtonStyle),
                        link("About", "/about", navButtonStyle)
                    ], {
                        display: "flex",
                        align_items: "center",
                        gap: "0.35rem"
                    })
                ]
            }),
            ...children
        ]
    })
}

function CodeBlock(content) {
    return new UIElement({
        tag: "pre",
        background: colors.code,
        color: "white",
        padding: "1rem",
        border_radius: "0.65rem",
        overflow_x: "auto",
        font_size: "0.9rem",
        line_height: "1.6",
        content: new UIElement({
            tag: "code",
            color: "inherit",
            content
        })
    })
}

function FeatureCard(title, description) {
    return new Wrapper([
        new Wrapper(title, {
            font_size: "1.05rem",
            font_weight: 850,
            color: colors.text
        }),
        new Wrapper(description, {
            margin_top: "0.7rem",
            color: colors.muted,
            line_height: "1.55"
        })
    ], {
        background: colors.panel,
        border: `1px solid ${colors.border}`,
        border_radius: "0.75rem",
        padding: "1.1rem"
    })
}

function CounterDemo() {
    return new Wrapper([
        new Wrapper("Live State Demo", {
            ...classes.mutedUppercase,
            color: colors.accentDark,
            opacity: 1
        }),
        new Wrapper(() => `Count: ${counter.get("count")}`, {
            margin_top: "0.65rem",
            font_size: "2.8rem",
            font_weight: 900,
            color: colors.text
        }),
        new Wrapper([
            new Button("Increment", {
                background: colors.accent,
                color: "white",
                padding: "0.7rem 0.95rem",
                border_radius: "0.5rem",
                font_weight: 800,
                cursor: "pointer",
                onclick: () => {
                    counter.set("count", counter.get("count") + 1)
                }
            }),
            new Button("Reset", {
                border: `1px solid ${colors.border}`,
                color: colors.text,
                padding: "0.7rem 0.95rem",
                border_radius: "0.5rem",
                font_weight: 800,
                cursor: "pointer",
                onclick: () => {
                    counter.set("count", 0)
                }
            })
        ], {
            display: "flex",
            gap: "0.6rem",
            margin_top: "1rem"
        })
    ], {
        background: colors.panel,
        border: `1px solid ${colors.border}`,
        border_radius: "0.85rem",
        padding: "1.4rem"
    })
}

export default function HomePage({ link }) {
    return [
        PageShell([
            new UIElement({
                tag: "main",
                max_width: "1120px",
                margin: "0 auto",
                padding: "5rem min(6vw, 4rem) 4rem",
                display: "grid",
                gap: "2rem",
                content: [
                    new HStack([
                        new Wrapper([
                            new Wrapper("Class-based interfaces for plain JavaScript", {
                                font_size: "clamp(2.4rem, 6vw, 5rem)",
                                line_height: "0.95",
                                font_weight: 950,
                                letter_spacing: "0",
                                color: colors.text
                            }),
                            new Wrapper("Ginger UI turns small JavaScript classes into browser interfaces. Compose UIElement subclasses, mount them with new Interface(), and use a Vite-powered routes directory for app pages.", {
                                margin_top: "1.25rem",
                                color: colors.muted,
                                font_size: "1.1rem",
                                line_height: "1.65",
                                max_width: "42rem"
                            }),
                            new Wrapper([
                                link("Read about routing", "/about", {
                                    background: colors.text,
                                    color: "white",
                                    padding: "0.8rem 1rem",
                                    border_radius: "0.55rem",
                                    font_weight: 850,
                                    cursor: "pointer"
                                }),
                                new Wrapper("npm install @aaron-meche/ginger-ui", {
                                    background: "hsla(0, 0%, 100%, 0.72)",
                                    border: `1px solid ${colors.border}`,
                                    color: colors.text,
                                    padding: "0.8rem 1rem",
                                    border_radius: "0.55rem",
                                    font_family: "ui-monospace, SFMono-Regular, Menlo, monospace",
                                    font_size: "0.9rem"
                                })
                            ], {
                                display: "flex",
                                flex_wrap: "wrap",
                                gap: "0.8rem",
                                margin_top: "1.7rem",
                                align_items: "center"
                            })
                        ]),
                        CounterDemo()
                    ], {
                        className: "hero-grid",
                        gap: "2rem",
                        align_items: "center",
                        grid_template_columns: "minmax(0, 1.35fr) minmax(18rem, 0.65fr)"
                    }),

                    new Wrapper([
                        FeatureCard("Importable package", "The root package exports Interface, UIElement, Button, Image, StateStore, and the router helpers through a normal npm entry."),
                        FeatureCard("File-system routes", "Each routes/**/+index.js file maps to the matching browser path, including routes/+index.js for / and routes/about/+index.js for /about."),
                        FeatureCard("No JSX required", "Pages are plain JavaScript functions that return UIElement instances, strings, arrays, or Interface content objects.")
                    ], {
                        display: "grid",
                        grid_template_columns: "repeat(auto-fit, minmax(15rem, 1fr))",
                        gap: "1rem"
                    }),

                    CodeBlock(`import { Interface, Wrapper } from "@aaron-meche/ginger-ui"

new Interface({
    app: [
        new Wrapper("Hello Ginger UI", {
            padding: "2rem",
            font_size: "2rem"
        })
    ]
})`)
                ]
            })
        ], { link })
    ]
}
