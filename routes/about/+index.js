//
// /about
//

import {
    Button,
    UIElement,
    Wrapper
} from "../../js/index.js"

export const title = "About Ginger UI"

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

function CodeBlock() {
    const codeText = [`const routes = import.meta.glob("./routes/**/+index.js")`,
        ``,
        `createRouter(routes, {`,
        `    target: "#app",`,
        `    title: "Ginger UI"`,
        `}).start()`,
    ].join("\n")
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
            content: codeText
        })
    })
}

function Row(title, description) {
    return new Wrapper([
        new Wrapper(title, {
            font_size: "1rem",
            font_weight: 850,
            color: colors.text
        }),
        new Wrapper(description, {
            margin_top: "0.4rem",
            color: colors.muted,
            line_height: "1.55"
        })
    ], {
        padding: "1rem 0",
        border_bottom: `1px solid ${colors.border}`
    })
}

export default function AboutPage({ navigate, link }) {
    return [
        new UIElement({
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
                            link("Home", "/", {
                                color: colors.text,
                                font_size: "0.9rem",
                                font_weight: 700,
                                padding: "0.6rem 0.85rem",
                                border_radius: "0.45rem",
                                cursor: "pointer"
                            })
                        ], {
                            display: "flex",
                            align_items: "center"
                        })
                    ]
                }),
                new UIElement({
                    tag: "main",
                    max_width: "920px",
                    margin: "0 auto",
                    padding: "4rem min(6vw, 4rem)",
                    content: [
                        new Wrapper("About the setup", {
                            font_size: "clamp(2.2rem, 5vw, 4rem)",
                            line_height: "1",
                            font_weight: 950,
                            color: colors.text
                        }),
                        new Wrapper("Ginger UI is now split into a package entry, a Vite demo app, and a file-system router inspired by SvelteKit route folders.", {
                            margin_top: "1rem",
                            max_width: "44rem",
                            color: colors.muted,
                            font_size: "1.08rem",
                            line_height: "1.65"
                        }),

                        new Wrapper([
                            Row("Package entry", "index.js re-exports the public API from js/index.js, which gathers interface.js and router.js."),
                            Row("Vite library build", "vite.config.js builds dist/ginger-ui.js and dist/ginger-ui.umd.cjs for npm consumers."),
                            Row("Demo app", "index.html loads script.js, and script.js discovers every routes/**/+index.js module through import.meta.glob."),
                            Row("Route files", "routes/+index.js maps to /, while routes/about/+index.js maps to /about.")
                        ], {
                            margin_top: "2rem",
                            background: colors.panel,
                            border: `1px solid ${colors.border}`,
                            border_radius: "0.8rem",
                            padding: "0 1.2rem"
                        }),

                        CodeBlock(),

                        new Wrapper([
                            new Button("Go home", {
                                background: colors.accent,
                                color: "white",
                                padding: "0.8rem 1rem",
                                border_radius: "0.55rem",
                                font_weight: 850,
                                cursor: "pointer",
                                onclick: () => navigate("/")
                            })
                        ], {
                            margin_top: "1.5rem"
                        })
                    ]
                })
            ]
        })
    ]
}
