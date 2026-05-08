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
        console.log(config)
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
    left = 0
    top = 0
    width = 0
    height = 0
    background = null
    outline = null
    text = null
    constructor(config) {
        let { 
            left, right,
            top, bottom,
            width, 
            height, 
            background, 
            outline,
            text
        } = config

        if (background) {
            ctx.fillStyle = background
            ctx.fillRect(left, top, width, height)
        }
        if (outline) {
            let split = outline?.split(" ")
            if (typeof split[0] == "string") {
                ctx.lineWidth = 1
                ctx.strokeStyle = split[0]
            }
            else {
                ctx.lineWidth = split[0]
                ctx.strokeStyle = split[1]
            }
            ctx.strokeRect(left, top, width, height)
        }
        if (text) {
            new Text(text, config)
        }
    }
}

ContentView(() => {
    new Rectangle({
        top: 50 * vh,
        left: 5 * vw,
        height: 5 * vh,
        width: 90 * vw,
        outline: "red"
    })
    new Text("Hey there, user!", {
        top: 50 * vh,
        left: 5 * vw,
        size: 5 * vh
    })
})