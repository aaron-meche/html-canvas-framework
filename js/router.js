import { Button, Interface, UIElement } from "./interface.js"

function normalizePath(path) {
    const parsed = new URL(path, window.location.origin)
    const normalized = parsed.pathname.replace(/\/+$/, "")
    return normalized || "/"
}

export function routePathFromFile(filePath) {
    let cleaned = filePath
        .replace(/\\/g, "/")
        .replace(/^\.\//, "")
        .replace(/^\/+/, "")
        .replace(/^routes\//, "")
        .replace(/\/\+index\.js$/, "")
        .replace(/^\+index\.js$/, "")

    if (!cleaned) return "/"
    return "/" + cleaned.replace(/^\/+/, "")
}

export function createRouteTable(routeModules) {
    const table = new Map()

    Object.keys(routeModules).forEach(filePath => {
        table.set(routePathFromFile(filePath), {
            filePath,
            loader: routeModules[filePath]
        })
    })

    return table
}

function normalizePageContent(pageContent) {
    if (Array.isArray(pageContent)) return { app: pageContent }
    if (pageContent instanceof UIElement) return { app: [pageContent] }
    if (typeof pageContent === "string") return { app: [pageContent] }
    if (pageContent?.app || pageContent?.body || pageContent?.main) return pageContent
    throw new Error("Route modules must return a UIElement, string, array, or Interface content object.")
}

async function loadRouteModule(route) {
    if (typeof route.loader === "function") return await route.loader()
    return route.loader
}

export function createRouter(routeModules, options = {}) {
    if (typeof window === "undefined") {
        throw new Error("Ginger UI routing requires a browser environment.")
    }

    const routes = createRouteTable(routeModules)
    const target = options.target ?? "#app"
    const fallbackTitle = options.title ?? "Ginger UI"

    let currentPath = normalizePath(window.location.pathname)

    const router = {
        routes,
        get path() {
            return currentPath
        },
        link(content, href, config = {}) {
            return new Button(content, {
                ...config,
                onclick: () => router.navigate(href)
            })
        },
        async render(path = window.location.pathname) {
            currentPath = normalizePath(path)
            const route = routes.get(currentPath)

            if (!route) {
                const notFound = options.notFound
                    ? options.notFound({ path: currentPath, router, navigate: router.navigate, link: router.link })
                    : [`<h1 style="font-family:sans-serif">404: ${currentPath}</h1>`]

                new Interface(normalizePageContent(notFound), { target })
                document.title = `Not found - ${fallbackTitle}`
                return
            }

            const module = await loadRouteModule(route)
            const page = module.default ?? module.Page ?? module.page

            if (!page) {
                throw new Error(`Route "${route.filePath}" must export a default page function or value.`)
            }

            const context = {
                path: currentPath,
                route: route.filePath,
                routes,
                router,
                navigate: router.navigate,
                link: router.link
            }

            const pageContent = typeof page === "function" ? page(context) : page
            new Interface(normalizePageContent(pageContent), { target })
            document.title = module.title ?? fallbackTitle
        },
        navigate(path, options = {}) {
            const nextPath = normalizePath(path)
            if (nextPath === currentPath && !options.force) return

            if (options.replace) {
                window.history.replaceState({}, "", nextPath)
            }
            else {
                window.history.pushState({}, "", nextPath)
            }

            router.render(nextPath)
        },
        start() {
            window.GingerUIRouter = router
            window.addEventListener("popstate", () => router.render(window.location.pathname))
            router.render(currentPath)
            return router
        }
    }

    return router
}
