export const colors = {
    page: "hsl(28, 26%, 96%)",
    text: "hsl(230, 22%, 12%)",
    muted: "hsl(232, 10%, 42%)",
    border: "hsl(28, 18%, 82%)",
    panel: "hsl(0, 0%, 100%)",
    accent: "hsl(17, 83%, 52%)",
    accentDark: "hsl(17, 72%, 34%)",
    code: "hsl(220, 24%, 14%)"
}

export const navButtonStyle = {
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

export const primaryButtonStyle = {
    background: colors.accent,
    color: "white",
    padding: "0.8rem 1rem",
    border_radius: "0.55rem",
    font_weight: 850,
    cursor: "pointer"
}
