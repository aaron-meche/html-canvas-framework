//
// script.js
//
// Mocha UI Framework
// Interface Designer
//
// created by Aaron Meche

import { 
    Interface,      // App Builder
    Rectangle,      // Basic UI Element DIV
    UIElement,      // Parent UI Element Class
    HStack, VStack, // Visual Elements
    StateStore,     // State Manager
    classes         // Style
} from "./js/interface.js"

let state = new StateStore({
    "counter": 0
})

const basicRectangle = (level) => {
    let base = 12
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
            elem.style.boxShadow = "inset 0 0 1rem 0 rgb(255, 255, 255)"
            state.update(data => {
                data.counter++
                return data
            })
        }
    })
}

let gradient = []
for (let i = 0; i < 10; i++) { gradient.push(basicRectangle(i)) }

const examples = [
    [
        new HStack(gradient),
        new Rectangle({
            ...classes.heading,
            ...classes.center,
            padding: "1.6rem",
            contains: () => {
                return "Counter: " + state.get("counter")
            }
        }),
        new Rectangle({
            ...classes.heading,
            ...classes.center,
            padding: "1.6rem",
            contains: () => {
                return state.get("time")
            }
        })
    ]
]

let startTime = Date.now()
state.set("time", 0)
setInterval(() => {
    let elapsed = Math.round((Date.now() - startTime) / 100)
    state.set("time", Math.round(elapsed))
})

const appContent = [
    new UIElement({
        padding: "1.2rem",
        background: "rgb(20, 20, 20)",
    })
]

const ui = new Interface({
    "app": examples[0]
})