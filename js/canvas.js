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

class Text {
    text = "Text"
    font = "Arial"
    color = "White"
    align = "left"
    baseline = "top"

    constructor(text, config) {
        this.text = text
        let {
            font,
            size,
            bold,
            italic,
            color,
            align,
            baseline,
        } = config

        bold = bold ? "bold" : ""
        italic = italic ? "italic" : ""
        size = size ? Math.round(size) + "px" : ""
        this.font = `${bold} ${italic} ${size} ${font ?? this.font}`

        ctx.font =          this.font
        ctx.fillStyle =     color       ?? this.color
        ctx.textAlign =     align       ?? this.align
        ctx.textBaseline =  baseline    ?? this.baseline
        ctx.fillText(text, Math.round(config.left), Math.round(config.top), 90 * vw)
    }
}

class Rectangle {
    constructor(config) {
        let configObj = handleConfig(config)
    }
}

function normalizeValue(val) {
    console.log(val)
    return val
}

function handleDynamicInputs(input, type, store) {
    let inputSplit = input.trim()?.split(" ")
    let handlers = {
        "position": (str) => {
            if (inputSplit.length == 1) {
                let val = normalizeValue(input.trim())
                store.top = val
                store.left = val
            }
            else if (inputSplit.length == 2) {
                store.top = normalizeValue(inputSplit[0])
                store.left = normalizeValue(inputSplit[1])
            }
            return store
        }
    }
    try {
        handlers?.[type]()
    }
    catch (err) {
        throw new Error(err)
    }
    return store
}

function handleConfig(config) {
    let position = {
        top: 0, bottom: null,
        left: 0, right: null,
        anchor: "tl", place: null
    }
    let size = {
        height: null, width: null,
        size: null,
    }
    const configKeys = Object.keys(config)
    const protocols = {
        "opacity":  input => { ctx.globalAlpha = input },
        "top":      input => { position.top = input },
        "bottom":   input => { position.bottom = input },
        "left":     input => { position.left = input },
        "right":    input => { position.right = input },
        "height":   input => { size.height = input },
        "width":    input => { size.width = input },
        "place":    input => {
            this.position = handleDynamicInputs(
                input,
                "position",
                position,
            )
        },
        "size":     input => {
            let split = input.trim().split(" ")
            if (split.length == 1) {
                size.height = input
                size.width = input
            }
            else if (split.length == 2) {
                size.height = split[0]
                size.width = split[1]
            }
        },
        "background": input => {
            ctx.fillStyle = input
            ctx.fillRect(position.left, position.top, size.width, size.height)
        },
        "fill":     input => protocols.background(input),
        "bg":       input => protocols.background(input),
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
            ctx.strokeRect(position.left, position.top, size.width, size.height)
        },
        "text":     input => { new Text(text, input) }
    }
    let completedProtocols = 0
    let totalProtocols = Object.keys(config).length
    const protocolKeys = Object.keys(protocols)
    for (let i = 0; i < protocolKeys.length; i++) {
        if (config?.[protocolKeys[i]]) {
            protocols[protocolKeys[i]](config[protocolKeys[i]])
            completedProtocols++
        }
        if (completedProtocols == totalProtocols) i = protocolKeys.length
    }
}

ContentView(() => {
    new Rectangle({
        place: "50 50",
        size: "100 100",
        background: "blue",
        opacity: 0.3,
    })
})