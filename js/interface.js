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

    hover = {

    }

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
            if (this.format.position == "relative") this.format.position = "absolute"
        },
        "onHover": input => {
            Object.keys(input).forEach(attr => {
                this.hover[attr] = input[attr]
            })
            console.log(this.hover)
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
                console.log(currConfigKey)
            }
            else {
                this.format[currConfigKey] = config[currConfigKey]
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

    getJSStyle() {
        let returnString = ""
        Object.keys(this.format).forEach(attr => {
            returnString += `this.style.${attr.replaceAll("_", "")}="${this.format[attr]}";`
        })
        return returnString
    }

    getHoverScripts() {
        let onMouseOver = ""
        let onMouseOut = ""

        return `onmouseover='${onMouseOver}' onmouseout='${onMouseOut}'`
    }

    getHTML() {
        let tag = null
        let html = [
            `<${this.tag} style='`,
            this.getStyle(this.style),
            `'>`,
            this.content,
            `</${this.tag}>`
        ]
        return html.join("")
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
        padding: "12pt",
        background: "rgb(20, 20, 200)",
        onHover: {
            background: "red"
        },
        contains: [
            "Hey there, what have you been up to?"
        ]
    })
])