import {
    Button,
    Wrapper,
    classes
} from "$lib"
import {
    colors,
    navButtonStyle,
    primaryButtonStyle
} from "$lib/theme.js"

export function AppShell(children, { link }) {
    return new Wrapper([
        new Wrapper([
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
        ], {
            tag: "nav",
            display: "flex",
            justify_content: "space-between",
            align_items: "center",
            padding: "1.1rem min(6vw, 4rem)",
            border_bottom: `1px solid ${colors.border}`
        }),
        children
    ], {
        min_height: "100vh",
        background: colors.page,
        color: colors.text
    })
}

export function PageMain(children, config = {}) {
    return new Wrapper(children, {
        tag: "main",
        max_width: config.max_width ?? "1120px",
        margin: "0 auto",
        padding: config.padding ?? "5rem min(6vw, 4rem) 4rem",
        display: "grid",
        gap: config.gap ?? "2rem",
        ...config
    })
}

export function Heading(text, config = {}) {
    return new Wrapper(text, {
        font_size: config.font_size ?? "clamp(2.4rem, 6vw, 5rem)",
        line_height: config.line_height ?? "0.95",
        font_weight: config.font_weight ?? 950,
        letter_spacing: "0",
        color: colors.text,
        ...config
    })
}

export function Lead(text, config = {}) {
    return new Wrapper(text, {
        margin_top: "1rem",
        max_width: "44rem",
        color: colors.muted,
        font_size: "1.08rem",
        line_height: "1.65",
        ...config
    })
}

export function ButtonRow(children, config = {}) {
    return new Wrapper(children, {
        display: "flex",
        flex_wrap: "wrap",
        gap: "0.8rem",
        margin_top: "1.7rem",
        align_items: "center",
        ...config
    })
}

export function InstallCommand(command) {
    return new Wrapper(command, {
        background: "hsla(0, 0%, 100%, 0.72)",
        border: `1px solid ${colors.border}`,
        color: colors.text,
        padding: "0.8rem 1rem",
        border_radius: "0.55rem",
        font_family: "ui-monospace, SFMono-Regular, Menlo, monospace",
        font_size: "0.9rem"
    })
}

export function CodeBlock(content) {
    return new Wrapper([
        new Wrapper(content, {
            tag: "code",
            color: "inherit"
        })
    ], {
        tag: "pre",
        background: colors.code,
        color: "white",
        padding: "1rem",
        border_radius: "0.65rem",
        overflow_x: "auto",
        font_size: "0.9rem",
        line_height: "1.6"
    })
}

export function FeatureCard(title, description) {
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

export function FeatureGrid(items) {
    return new Wrapper(items.map(item => FeatureCard(item.title, item.description)), {
        display: "grid",
        grid_template_columns: "repeat(auto-fit, minmax(15rem, 1fr))",
        gap: "1rem"
    })
}

export function InfoRow(title, description) {
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

export function InfoPanel(items) {
    return new Wrapper(items.map(item => InfoRow(item.title, item.description)), {
        margin_top: "2rem",
        background: colors.panel,
        border: `1px solid ${colors.border}`,
        border_radius: "0.8rem",
        padding: "0 1.2rem"
    })
}

export function CounterPanel(counter) {
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
                ...primaryButtonStyle,
                padding: "0.7rem 0.95rem",
                border_radius: "0.5rem",
                font_weight: 800,
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

export function PrimaryLink(label, href, link) {
    return link(label, href, {
        background: colors.text,
        color: "white",
        padding: "0.8rem 1rem",
        border_radius: "0.55rem",
        font_weight: 850,
        cursor: "pointer"
    })
}
