//
// script.js
//
// HTML UI Framework
// main Interface Designer
//
// created by Aaron Meche

import { 
    Interface,
    Rectangle, HStack 
} from "./js/interface.js"

const adjustColor = (level) => { 
    let base = 25
    let size = 8
    let sum = base + size * level
    return `rgb(${sum}, ${sum}, ${sum})` 
}

const basicRectangle = (level) => {
    let counter = 0
    let base = 24
    let size = 12
    let sum = base + size * level
    let color = `rgb(${sum}, ${sum}, ${sum})` 
    return new Rectangle({
        padding: "36pt 12pt",
        background: color,
        text_align: "center",
        font_size: "10pt",
        font_weight: 600,
        contains: [
            "Level " + level
        ],
        onhover: (elem) => {
            elem.style.opacity = 0.5
        },
        onclick: (elem) => {
            counter++
            elem.style.background = "red"
            setTimeout(() => {
                elem.style.background = color
            }, 1000)
        }
    })
}

const ui = new Interface({
    "app": [
        new HStack([
            basicRectangle(0),
            basicRectangle(1),
            basicRectangle(2),
            basicRectangle(3),
            basicRectangle(4),
            basicRectangle(5),
            basicRectangle(6),
        ])
    ]
})