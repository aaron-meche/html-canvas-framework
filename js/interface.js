//
// HTML Body UI Framework
//
// created on May 10 2026
// written by Aaron Meche
//

// Window
let app = null
let windowHeight, windowWidth

function ContentView(arr) {
    arr.forEach(elem => {
        body.innerHTML += elem.getHTML()
    })
}

export class Interface {
    head = null
    body = null
    constructor(contents) {
        const body = document.body
        body.style.margin = 0
        try { 
            let bodyTarget = contents?.["app"] ?? contents?.["body"] ?? contents?.["main"] ?? null
            if (bodyTarget) bodyTarget.forEach(elem => { body.innerHTML += elem.getHTML() }) 
            else throw new Error("No bodyTarget found when building interface.")
        }
        catch (err) { throw new Error(err) }
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

    protocols = {
        "place":    input => { 
            let split = input.trim().split(" ")
            if (split.length == 1) {
                this.format.top = input
                this.format.left = input
            }
            else if (split.length == 2) {
                this.format.top = split[0]
                this.format.left = split[1]
            }
        },
        "size":     input => { 
            let split = input.trim().split(" ")
            if (split.length == 1) {
                this.format.height = input
                this.format.width = input
            }
            else if (split.length == 2) {
                this.format.height = split[0]
                this.format.width = split[1]
            }
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
            input.forEach(elem => {
                if (typeof elem == "string") this.content += elem
                else this.content += elem.getHTML()
            })
        }
    }

    constructor(config) {
        let configKeys = Object.keys(config)
        for (let i = 0; i < configKeys.length; i++) {
            const currConfigKey = configKeys[i]
            if (this.protocols[currConfigKey]) {
                this.protocols[currConfigKey](config[currConfigKey])
            }
            else {
                this.format[currConfigKey] = config[currConfigKey]
            }
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

    getHTML() {
        let tag = null
        let html = [
            "<", this.tag, " ",
            "style='", this.getStyle(this.style), "'",
            this.getBehaviorString(),
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