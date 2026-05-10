//
// HTML Body UI Framework
//
// created on May 10 2026
// written by Aaron Meche
//

// Window
let docHead = null
let docBody = null
let stateManager = {}
let windowHeight, windowWidth

export class Interface {
    constructor(contents) {
        if (!document) return
        docBody = document.body
        docBody.style.margin = 0
        let bodyContent = ""
        let bodyTarget = contents?.["app"] 
            ?? contents?.["body"] 
            ?? contents?.["main"] 
            ?? null
        if (!bodyTarget || !Array.isArray(bodyTarget)) 
            throw new Error("Invalid or missing bodyTarget input to interface.")
        for (let i = 0; i < bodyTarget.length; i++) {
            const currElem = bodyTarget[i]
            if (typeof currElem == "string") bodyContent += currElem
            else bodyContent += currElem.getHTML()
        }
        docBody.innerHTML = bodyContent + docBody.innerHTML
    }
}

function checkWindowClickRegistry() {
    if (!window.dispatchHover) {
        window.hoverState = new Map()
        window.dispatchHover = (id, elem) => {
            const handler = window.clickRegistry.get(id)
            if (typeof handler === 'function') {
                window.hoverState.set(id, elem.style.cssText)
                handler(elem)
            }
        }
        window.dispatchHoverOut = (id, elem) => {
            const origStyle = window.hoverState.get(id)
            if (origStyle) {
                elem.style.cssText = origStyle
                window.hoverState.delete(id)
            }
        }
    }
    if (!window.clickRegistry) {
        window.clickRegistry = new Map()
        window.dispatchClick = (id, elem) => {
            const handler = window.clickRegistry.get(id)
            if (typeof handler === 'function') {
                handler(elem)
            }
        }
    }
}

export class UIElement {
    tag = "div"
    content = ""

    format = {
        display: "block",
        height: "auto",
        width: "auto",
        // Font Styling
        font_family: "Arial",
        text_align: "left",
        font_size: "12pt",
        color: "white"
    }

    behaviors = {}
    identifiers = {}

    protocols = {
        "place":    input => { 
            let split = input.trim().split(" ")
            if (split.length == 1) { this.format.top = input; this.format.left = input }
            else if (split.length == 2) { this.format.top = split[0]; this.format.left = split[1] }
            else throw new Error("unsupported 'place' input")
        },
        "size":     input => { 
            let split = input.trim().split(" ")
            if (split.length == 1) { this.format.height = input; this.format.width = input }
            else if (split.length == 2) {this.format.height = split[0]; this.format.width = split[1] }
            else throw new Error("unsupported 'size' input")
        },
        "onhover": input => {
            checkWindowClickRegistry()
            const id = 'hov_' + Math.random().toString(36).substring(2, 11)
            window.clickRegistry.set(id, input)
            this.behaviors.onmouseenter = "window.dispatchHover('" + id + "', this);"
            this.behaviors.onmouseleave = "window.dispatchHoverOut('" + id + "', this);"
        },
        "onclick": input => {
            checkWindowClickRegistry()
            const id = 'clk_' + Math.random().toString(36).substring(2, 11);
            window.clickRegistry.set(id, input);
            this.behaviors.onclick = "window.dispatchClick('" + id + "', this);"
        },
        "contains": input => {
            // Default, Array-based content
            if (Array.isArray(input)) {
                let contentArray = input
                contentArray.forEach(elem => {
                    if (typeof elem == "string")
                        this.content += elem
                    else this.content += elem.getHTML()
                })
            }
            // State, Function-based content
            else if (typeof input == "function") {
                const id = 'hov_' + Math.random().toString(36).substring(2, 11)
                this.content = input()
                this.identifiers["live_state"] = id
                stateManager[id] = input
            }
        }
    }

    constructor(config) {
        let configKeys = Object.keys(config)
        for (let i = 0; i < configKeys.length; i++) {
            const currConfigKey = configKeys[i]
            if (this.protocols[currConfigKey])
                this.protocols[currConfigKey](config[currConfigKey])
            else this.format[currConfigKey] = config[currConfigKey]
        }
    }

    getStyle() {
        let returnString = ""
        Object.keys(this.format).forEach(attr => {
            returnString += `${attr.replaceAll("_", "-")}:${this.format[attr]};`
        })
        return returnString
    }

    getBehaviorString() {
        if (!this.behaviors) return ""
        let returnString = ""
        Object.keys(this.behaviors).forEach(behavior => {
            returnString += " " + behavior + '="' + this.behaviors[behavior] + '";'
        })
        return returnString
    }

    getIdentifierString() {
        if (!this.identifiers) return ""
        let returnString = ""
        Object.keys(this.identifiers).forEach(id => {
            returnString += " " + id + '="' + this.identifiers[id] + '" '
        })
        return returnString
    }

    getHTML() {
        let tag = null
        let html = [
            "<", this.tag, " ",
            "style='", this.getStyle(this.style), "'",
            this.getBehaviorString(), this.getIdentifierString(),
            " ",
            ">", this.content, "</", this.tag, ">"
        ]
        return html.join("")
    }
}

export class Rectangle extends UIElement {
    constructor(config) {
        super(config)
    }
}

export class HStack extends UIElement {
    constructor(elements, config = {}) {
        super({
            ...config,
            display: "grid",
            grid_template_columns: "repeat(" + elements.length + ", 1fr)",
            contains: elements
        })
    }
}

export class VStack extends UIElement {
    constructor(elements, config = {}) {
        super({
            ...config,
            display: "grid",
            grid_template_columns: "1fr",
            contains: elements
        })
    }
}

export class StateStore {
    #data = {}

    constructor(init) {
        if (init) this.#data = init
    }

    #updateUI() {
        document.querySelectorAll("[live_state]").forEach(elem => {
            elem.innerHTML = stateManager[elem.getAttribute("live_state")]()
        })
    }

    set(key, val) { this.#data[key] = val; this.#updateUI() }
    get(key) { return this.#data?.[key] }
    update(callback) { 
        if (!callback) { this.#updateUI(); return }
        let response = callback(this.#data) 
        if (response) { this.#data = response; this.#updateUI() }
        else throw new Error("Error during state update")
    }
}

export const classes = {
    "heading": {
        font_size: "2.4rem",
        font_weight: "700",
    },
    "center": {
        display: "flex",
        align_items: "center",
        justify_content: "center",
    }
}