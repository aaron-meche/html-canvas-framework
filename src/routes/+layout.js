import { AppShell } from "$lib/components.js"

export default function Layout({ children, link }) {
    return AppShell(children, { link })
}
