//
// HTML Canvas
//
// created on May 7 2026
// written by Aaron Meche
//

// Canvas
const canvas = document.getElementById("canvas")
const ctx = canvas.getContext("2d")
canvas.style.position = "absolute"
canvas.style.top = 0
canvas.style.left = 0

// Window
let app = null
let dpr = window.devicePixelRatio || 1
let windowHeight, windowWidth, vh, vw, mh, mw, center

// Preparing Canvas
window.addEventListener('resize', () => { ContentView(app) });
function clearCanvas() { ctx.clearRect(0, 0, windowWidth, windowHeight) }
function resizeCanvas() {
    windowHeight = window.innerHeight
    windowWidth = window.innerWidth
    canvas.height = windowHeight * dpr;
    canvas.width = windowWidth * dpr;
    ctx.scale(dpr, dpr);
    vh = windowHeight / 100 / dpr
    vw = windowWidth / 100 / dpr
    mh = windowHeight / 2 / dpr
    mw = windowWidth / 2 / dpr
    center = [windowWidth / 2, windowHeight / 2]
    ctx.textBaseline = "top";
    ctx.textAlign = "left";

    app()
}

function ContentView(cb) {
    app = cb
    clearCanvas()
    resizeCanvas()
}

class UIElement {
    position = { top: 0, left: 0, anchor: "tl" }
    size = { height: null, width: null }
    format = {
        text: "Default Text",
        font: "Arial",
        color: "white",
        align: "left",
        baseline: "top",
        bold: "", 
        italic: "",
        size: "12pt"
    }
    protocols = {
        // High Priority
        "opacity":  input => { ctx.globalAlpha = input },
        // Text Formatting
        "bold":     input => { this.format.bold = "bold" },
        "italic":   input => { this.format.italic = "italic" },
        "color":    input => { this.format.color = input },
        "align":    input => { this.format.align = input },
        "baseline": input => { this.format.baseline = input },
        "fontSize": input => { this.format.size = normalizeValue(input) + "px" },
        // Positioning
        "top":      input => { this.position.top = input },
        "left":     input => { this.position.left = input },
        "place":    input => { this.position = handleDynamicInputs(input, "position", this.position) },
        // Sizing
        "height":   input => { this.size.height = input },
        "width":    input => { this.size.width = input },
        "size":     input => { this.size = handleDynamicInputs(input, "size", this.size) },
        // Element Formatting
        "background": input => {
            ctx.fillStyle = input
            ctx.fillRect(this.position.left, this.position.top, this.size.width, this.size.height)
        },
        "fill":     input => this.protocols.background(input),
        "bg":       input => this.protocols.background(input),
        "outline":  input => {
            let split = input.trim().split(" ")
            if (split.length == 1) {
                ctx.lineWidth = 1
                ctx.strokeStyle = input.trim()
            }
            else {
                ctx.lineWidth = split[0]
                ctx.strokeStyle = split[1]
            }
            ctx.strokeRect(this.position.left, this.position.top, this.size.width, this.size.height)
        },
    }
    constructor(config) {
        let configKeys = Object.keys(config)
        let protocolCounter = [0, configKeys.length]
        let protocolKeys = Object.keys(this.protocols)
        for (let i = 0; i < protocolKeys.length; i++) {
            if (config?.[protocolKeys[i]]) {
                this.protocols[protocolKeys[i]](config[protocolKeys[i]])
                protocolCounter[0]++
            }
            if (protocolCounter[0] == protocolCounter[1]) i = protocolKeys.length
        }
    }
}

class Text extends UIElement {
    #getFontString() {
        let string = ""
        if (this.format.bold) string += this.format.bold + " "
        if (this.format.italic) string += this.format.italic + " "
        string += this.format.size + " "
        string += this.format.font
        return string
    }

    constructor(text, config) {
        super(config)
        ctx.font            = this.#getFontString()
        ctx.fillStyle       = this.format.color
        ctx.textAlign       = this.format.align
        ctx.textBaseline    = this.format.baseline
        ctx.fillText(text, Math.round(this.position.left), Math.round(this.position.top))
    }
}

class Rectangle extends UIElement {
    constructor(config) {
        super(config)
    }
}

class Background extends Rectangle {
    constructor(config) {
        super({
            ...config,
            size: "100% 100%",
            background: config.background ?? "yellow"
        })
    }
}

function normalizeValue(val, orient) {
    val = String(val)
    if (val.includes("vh")) {
        try { return Number(val.trim().replace("vh", "")) * vh }
        catch (err) { throw new Error(err) }
    }
    else if (val.includes("vw")) {
        try { return Number(val.trim().replace("vw", "")) * vw }
        catch (err) { throw new Error(err) }
    }
    else if (val.includes("%")) {
        if (!orient) throw new Error("% based values are invalid in instance: " + val)
        try {
            try { return Number(val.trim().replace("%", "")) * (orient == "vert" ? vh : vw) }
            catch (err) { throw new Error(err) }
        }
        catch (err) { throw new Error(err) }
    }
    return val
}

function handleDynamicInputs(input, type, store) {
    let inputSplit = input.trim()?.split(" ")
    let handlers = {
        "position": (str) => {
            if (inputSplit.length == 1) {
                let val = normalizeValue(input)
                store.top = val
                store.left = val
            }
            else if (inputSplit.length == 2) {
                store.top = normalizeValue(inputSplit[0], "vert")
                store.left = normalizeValue(inputSplit[1], "horiz")
            }
            return store
        },
        "size": (str) => {
            if (inputSplit.length == 1) {
                let val = normalizeValue(input)
                store.height = val
                store.width = val
            }
            else if (inputSplit.length == 2) {
                store.height = normalizeValue(inputSplit[0], "vert")
                store.width = normalizeValue(inputSplit[1], "horiz")
            }
            return store
        }
    }
    try { handlers?.[type]() }
    catch (err) { throw new Error(err) }
    return store
}

ContentView(() => {
    new Background({
        background: "rgb(20, 20, 20)"
    })
    new Rectangle({
        place: "10% 10%",
        size: "80% 80%",
        background: "blue",
        opacity: 0.3,
    })
    new Text("Title Text", {
        place: "50% 50%",
        fontSize: 24,
        align: "center",
        baseline: "middle"
    })
})