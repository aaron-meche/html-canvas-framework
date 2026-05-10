import { Button, Interface, UIElement } from "./interface.js"

function normalizePath(path) {
    const parsed = new URL(path, window.location.origin)
    const normalized = parsed.pathname.replace(/\/+$/, "")
    return normalized || "/"
}

function stripRoutesPrefix(filePath) {
    const cleaned = filePath
        .replace(/\\/g, "/")
        .replace(/^\.\//, "")
        .replace(/^\/+/, "")

    const routesIndex = cleaned.indexOf("routes/")
    if (routesIndex === -1) return cleaned
    return cleaned.slice(routesIndex + "routes/".length)
}

export function routePathFromFile(filePath) {
    let cleaned = stripRoutesPrefix(filePath)
        .replace(/\/\+index\.js$/, "")
        .replace(/^\+index\.js$/, "")

    if (!cleaned) return "/"
    return "/" + cleaned.replace(/^\/+/, "")
}

export function layoutPathFromFile(filePath) {
    let cleaned = stripRoutesPrefix(filePath)
        .replace(/\/\+layout\.js$/, "")
        .replace(/^\+layout\.js$/, "")

    if (!cleaned) return "/"
    return "/" + cleaned.replace(/^\/+/, "")
}

export function createRouteTable(routeModules) {
    const table = new Map()

    Object.keys(routeModules).forEach(filePath => {
        if (!filePath.endsWith("+index.js")) return
        table.set(routePathFromFile(filePath), {
            filePath,
            loader: routeModules[filePath]
        })
    })

    return table
}

export function createLayoutTable(layoutModules = {}) {
    const table = new Map()

    Object.keys(layoutModules).forEach(filePath => {
        if (!filePath.endsWith("+layout.js")) return
        table.set(layoutPathFromFile(filePath), {
            filePath,
            loader: layoutModules[filePath]
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

function getContentChildren(content) {
    const normalized = normalizePageContent(content)
    return normalized.app ?? normalized.body ?? normalized.main ?? []
}

async function loadRouteModule(route) {
    if (typeof route.loader === "function") return await route.loader()
    return route.loader
}

function getLayoutChain(path, layouts) {
    const segments = normalizePath(path).split("/").filter(Boolean)
    let current = ""
    const candidates = ["/"]

    segments.forEach(segment => {
        current += "/" + segment
        candidates.push(current)
    })

    return candidates.filter(candidate => layouts.has(candidate))
}

export function createRouter(routeModules, options = {}) {
    if (typeof window === "undefined") {
        throw new Error("Ginger UI routing requires a browser environment.")
    }

    const routeInput = routeModules?.routes ?? routeModules
    const layoutInput = routeModules?.layouts ?? options.layouts ?? {}
    const routes = createRouteTable(routeInput)
    const layouts = createLayoutTable(layoutInput)
    const target = options.target ?? "#app"
    const fallbackTitle = options.title ?? "Ginger UI"

    let currentPath = normalizePath(window.location.pathname)

    const router = {
        routes,
        layouts,
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

                const wrappedNotFound = await router.applyLayouts(notFound, {
                    path: currentPath,
                    route: null,
                    routes,
                    layouts,
                    router,
                    navigate: router.navigate,
                    link: router.link
                })

                new Interface(normalizePageContent(wrappedNotFound), { target })
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
                layouts,
                router,
                navigate: router.navigate,
                link: router.link
            }

            const pageContent = typeof page === "function" ? await page(context) : page
            const wrappedContent = await router.applyLayouts(pageContent, context)

            new Interface(normalizePageContent(wrappedContent), { target })
            document.title = module.title ?? fallbackTitle
        },
        async applyLayouts(content, context) {
            let nextContent = content
            const layoutChain = getLayoutChain(context.path, layouts)

            for (let i = layoutChain.length - 1; i >= 0; i--) {
                const layoutRoute = layouts.get(layoutChain[i])
                const layoutModule = await loadRouteModule(layoutRoute)
                const layout = layoutModule.default ?? layoutModule.Layout ?? layoutModule.layout

                if (!layout) {
                    throw new Error(`Layout "${layoutRoute.filePath}" must export a default layout function or value.`)
                }

                const layoutContext = {
                    ...context,
                    layout: layoutRoute.filePath,
                    children: getContentChildren(nextContent)
                }

                nextContent = typeof layout === "function" ? await layout(layoutContext) : layout
            }

            return nextContent
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
