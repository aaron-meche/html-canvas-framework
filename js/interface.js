//
// HTML Body UI Framework
//
// created on May 10 2026
// written by Aaron Meche
//

// Body
const body = document.getElementById("body")
body.style.margin = 0

// Window
let app = null
let windowHeight, windowWidth

function ContentView(arr) {
    arr.forEach(elem => {
        body.innerHTML += elem.getHTML()
    })
}

class UIElement {
    tag = "div"
    content = ""
    format = {
        position: "relative",
        display: "block",
        height: "auto",
        width: "auto",
        // Font Styling
        font_family: "Arial",
        text_align: "left",
        font_size: "12pt",
        color: "white"
    }
    protocols = {
        // High Priority
        "opacity":  input => { this.style.opacity = input },
        // Text Formatting
        "bold":     input => { this.format.font_weight = "bold" },
        "italic":   input => { this.format.font_style = "italic" },
        "color":    input => { this.format.color = input },
        "align":    input => { this.format.align = input },
        "fontSize": input => { this.format.size = input },
        // Positioning
        "position": input => { this.format.position = input },
        "top":      input => { this.format.top = input },
        "left":     input => { this.format.left = input },
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
        // Sizing
        "height":   input => { this.format.height = input },
        "width":    input => { this.format.width = input },
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
            if (this.format.position == "relative") this.format.position = "absolute"
         },
        // Element Formatting
        "background": input => { this.format.background = input },
        "fill":     input => { this.format.background = input },
        "bg":       input => { this.format.background = input },
        "outline":  input => { this.format.outline = input},
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
                console.log(currConfigKey)
            }
        }
    }
    getStyle() {
        let returnString = ""
        Object.keys(this.format).forEach(attr => {
            returnString += `${attr.replaceAll("_", "-")}: ${this.format[attr]};`
        })
        return returnString
    }
    getHTML() {
        let tag = null
        let html = [
            `<${this.tag} style='`,
            this.getStyle(),
            `'>`,
            this.content,
            `</${this.tag}>`
        ]
        return html.join("")
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

ContentView([
    new Rectangle({
        place: "10% 10%",
        size: "150pt 80%",
        background: "rgb(20, 20, 200)",
        contains: [
            "Hey there, what have you been up to?"
        ]
    })
])