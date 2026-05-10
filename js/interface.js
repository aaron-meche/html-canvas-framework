//
// Ginger UI
//
// A small class-based UI framework for browser interfaces.
//

let docBody = null
let stateManager = {}

const attributeKeys = new Set([
    "id",
    "class",
    "className",
    "href",
    "target",
    "rel",
    "alt",
    "title",
    "type",
    "role",
    "name",
    "value",
    "placeholder",
    "for",
    "tabindex"
])

function isBrowser() {
    return typeof document !== "undefined"
}

function escapeAttribute(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll('"', "&quot;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
}

export function toHTML(input) {
    if (input === null || input === undefined || input === false) return ""
    if (Array.isArray(input)) return input.map(item => toHTML(item)).join("")
    if (typeof input.getHTML === "function") return input.getHTML()
    return String(input)
}

function normalizeContent(contents) {
    if (Array.isArray(contents)) return contents
    if (contents?.app !== undefined) return contents.app
    if (contents?.body !== undefined) return contents.body
    if (contents?.main !== undefined) return contents.main
    if (typeof contents === "string" || typeof contents?.getHTML === "function") {
        return [contents]
    }
    return null
}

function resolveTarget(target) {
    if (!target) return document.body
    if (typeof target === "string") {
        const resolved = document.querySelector(target)
        if (!resolved) throw new Error(`Ginger UI could not find target "${target}".`)
        return resolved
    }
    return target
}

function checkWindowEventRegistry() {
    if (!window.gingerUIRegistry) {
        window.gingerUIRegistry = {
            handlers: new Map(),
            hoverState: new Map()
        }
    }

    if (!window.clickRegistry) {
        window.clickRegistry = window.gingerUIRegistry.handlers
    }

    if (!window.dispatchClick) {
        window.dispatchClick = (id, elem) => {
            const handler = window.gingerUIRegistry.handlers.get(id)
            if (typeof handler === "function") handler(elem)
        }
    }

    if (!window.dispatchHover) {
        window.dispatchHover = (id, elem) => {
            const handler = window.gingerUIRegistry.handlers.get(id)
            if (typeof handler === "function") {
                window.gingerUIRegistry.hoverState.set(id, elem.style.cssText)
                handler(elem)
            }
        }
    }

    if (!window.dispatchHoverOut) {
        window.dispatchHoverOut = (id, elem) => {
            const originalStyle = window.gingerUIRegistry.hoverState.get(id)
            if (originalStyle !== undefined) {
                elem.style.cssText = originalStyle
                window.gingerUIRegistry.hoverState.delete(id)
            }
        }
    }
}

export class Interface {
    constructor(contents = {}, options = {}) {
        if (!isBrowser()) return

        docBody = document.body
        docBody.style.margin = 0

        const target = resolveTarget(options.target ?? contents.target)
        const bodyTarget = normalizeContent(contents)

        if (!bodyTarget || !Array.isArray(bodyTarget)) {
            throw new Error("Invalid or missing app, body, or main input to Interface.")
        }

        target.innerHTML = toHTML(bodyTarget)
    }
}

export class UIElement {
    tag = "div"
    src = null
    self = false
    content = ""

    format = {
        display: "block",
        height: "auto",
        width: "auto",
        color: "white"
    }

    attributes = {}
    behaviors = {}
    identifiers = {}

    protocols = {
        "tag": input => {
            this.tag = input
        },
        "self": input => {
            this.self = Boolean(input)
        },
        "src": input => {
            this.src = input
        },
        "attrs": input => {
            this.setAttributes(input)
        },
        "attributes": input => {
            this.setAttributes(input)
        },
        "aria": input => {
            Object.keys(input ?? {}).forEach(key => {
                this.attributes[`aria-${key.replaceAll("_", "-")}`] = input[key]
            })
        },
        "data": input => {
            Object.keys(input ?? {}).forEach(key => {
                this.attributes[`data-${key.replaceAll("_", "-")}`] = input[key]
            })
        },
        "place": input => {
            let split = input.trim().split(" ")
            if (split.length == 1) {
                this.format.top = input
                this.format.left = input
            }
            else if (split.length == 2) {
                this.format.top = split[0]
                this.format.left = split[1]
            }
            else throw new Error("unsupported 'place' input")
        },
        "size": input => {
            let split = input.trim().split(" ")
            if (split.length == 1) {
                this.format.height = input
                this.format.width = input
            }
            else if (split.length == 2) {
                this.format.height = split[0]
                this.format.width = split[1]
            }
            else throw new Error("unsupported 'size' input")
        },
        "onhover": input => {
            checkWindowEventRegistry()
            const id = "hov_" + Math.random().toString(36).substring(2, 11)
            window.gingerUIRegistry.handlers.set(id, input)
            this.behaviors.onmouseenter = `window.dispatchHover('${id}', this);`
            this.behaviors.onmouseleave = `window.dispatchHoverOut('${id}', this);`
        },
        "onclick": input => {
            checkWindowEventRegistry()
            const id = "clk_" + Math.random().toString(36).substring(2, 11)
            window.gingerUIRegistry.handlers.set(id, input)
            this.behaviors.onclick = `window.dispatchClick('${id}', this);`
        },
        "contains": input => {
            this.content = toHTML(input)
        },
        "content": input => {
            if (typeof input == "function") {
                const id = "state_" + Math.random().toString(36).substring(2, 11)
                this.content = toHTML(input())
                this.identifiers.live_state = id
                stateManager[id] = input
                return
            }

            this.content = toHTML(input)
        }
    }

    constructor(config = {}) {
        let configKeys = Object.keys(config ?? {})
        for (let i = 0; i < configKeys.length; i++) {
            const currConfigKey = configKeys[i]
            const currConfigValue = config[currConfigKey]

            if (this.protocols[currConfigKey]) {
                this.protocols[currConfigKey](currConfigValue)
            }
            else if (attributeKeys.has(currConfigKey)) {
                this.attributes[currConfigKey === "className" ? "class" : currConfigKey] = currConfigValue
            }
            else {
                this.format[currConfigKey] = currConfigValue
            }
        }
    }

    setAttributes(input = {}) {
        Object.keys(input ?? {}).forEach(key => {
            this.attributes[key === "className" ? "class" : key] = input[key]
        })
    }

    getStyle() {
        let returnString = ""
        Object.keys(this.format).forEach(attr => {
            const value = this.format[attr]
            if (value === null || value === undefined || value === false) return
            returnString += `${attr.replaceAll("_", "-")}:${value};`
        })
        return returnString
    }

    getBehaviorString() {
        let returnString = ""
        Object.keys(this.behaviors).forEach(behavior => {
            returnString += ` ${behavior}="${escapeAttribute(this.behaviors[behavior])}"`
        })
        return returnString
    }

    getAttributeString() {
        const attrs = {
            ...this.attributes,
            ...this.identifiers
        }

        let returnString = ""
        Object.keys(attrs).forEach(attr => {
            const value = attrs[attr]
            if (value === null || value === undefined || value === false) return
            if (value === true) {
                returnString += ` ${attr}`
                return
            }
            returnString += ` ${attr}="${escapeAttribute(value)}"`
        })
        return returnString
    }

    getHTML() {
        const style = this.getStyle()
        const src = this.src ? ` src="${escapeAttribute(this.src)}"` : ""
        const styleAttribute = style ? ` style="${escapeAttribute(style)}"` : ""
        const openingTag = `<${this.tag}${src}${styleAttribute}${this.getAttributeString()}${this.getBehaviorString()}>`

        if (this.self) return openingTag
        return `${openingTag}${this.content}</${this.tag}>`
    }
}

export class Image extends UIElement {
    constructor(imgURL, config = {}) {
        super({
            ...config,
            src: imgURL
        })
        this.tag = "img"
        this.self = true
    }
}

export class Button extends UIElement {
    constructor(content, config = {}) {
        super({
            ...config,
            content: content
        })
        this.tag = "button"
    }
}

export class Rectangle extends UIElement {
    constructor(config = {}) {
        super(config)
    }
}

export class HStack extends UIElement {
    constructor(elements, config = {}) {
        super({
            ...config,
            display: "grid",
            grid_template_columns: config.grid_template_columns ?? `repeat(${elements.length}, 1fr)`,
            content: elements
        })
    }
}

export class VStack extends UIElement {
    constructor(elements, config = {}) {
        super({
            ...config,
            display: "grid",
            grid_template_rows: config.grid_template_rows ?? `repeat(${elements.length}, auto)`,
            content: elements
        })
    }
}

export class Wrapper extends UIElement {
    constructor(content, config = {}) {
        super({
            ...config,
            content: content
        })
    }
}

export class StateStore {
    #data = {}

    constructor(init) {
        if (init) this.#data = init
    }

    #updateUI() {
        if (!isBrowser()) return
        document.querySelectorAll("[live_state]").forEach(elem => {
            const stateId = elem.getAttribute("live_state")
            if (typeof stateManager[stateId] === "function") {
                elem.innerHTML = toHTML(stateManager[stateId]())
            }
        })
    }

    set(key, val) {
        this.#data[key] = val
        this.#updateUI()
    }

    get(key) {
        return this.#data?.[key]
    }

    update(callback) {
        if (!callback) {
            this.#updateUI()
            return
        }

        let response = callback(this.#data)
        if (response) {
            this.#data = response
            this.#updateUI()
            return
        }

        throw new Error("Error during state update")
    }
}

export const classes = {
    "heading": {
        font_size: "2.4rem",
        font_weight: "700"
    },
    "center": {
        display: "flex",
        align_items: "center",
        justify_content: "center"
    },
    "mutedUppercase": {
        font_size: "0.9rem",
        font_weight: "700",
        text_transform: "uppercase",
        letter_spacing: "0.3pt",
        opacity: 0.6
    }
}
