//
// script.js
//
// HTML UI Framework
// main Interface Designer
//
// created by Aaron Meche

import { 
    Interface,
    Rectangle, 
    HStack, VStack
} from "./js/interface.js"

const adjustColor = (level) => { 
    let base = 25
    let size = 8
    let sum = base + size * level
    return `rgb(${sum}, ${sum}, ${sum})` 
}

let counter = 0
const liveCounter = () => {
    return new Rectangle({
        padding: "12pt",
        font_size: "2rem",
        font_weight: "600",
        letter_spacing: "1pt",
        text_align: "center",
        contains: [
            "Live Counter ... WIP"
        ]
    })
}

const basicRectangle = (level) => {
    let base = 0
    let size = 12
    let sum = base + size * level
    let color = `rgb(${sum}, ${sum}, ${sum})` 
    return new Rectangle({
        height: "10vh",
        background: color,
        text_align: "center",
        font_size: "10pt",
        font_weight: 600,
        opacity: 0.5,
        onhover: (elem) => {
            elem.style.opacity = 1
        }
    })
}

console.time("build")
let gradient = []
let gradient_stacks = []
for (let i = 0; i < 10; i++) {
    gradient.push(basicRectangle(i))
}
for (let i = 0; i < 10; i++) {
    gradient_stacks.push(new HStack(gradient))
}

const ui = new Interface({
    "app": [
        new VStack(gradient_stacks)
    ]
})
console.timeEnd("build")