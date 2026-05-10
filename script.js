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
    Wrapper,        // Content Wrapper
    StateStore,     // State Manager
    classes         // Style
} from "./js/interface.js"

let state = new StateStore({
    "counter": 0
})

const basicColor = (level) => {
    const base = [240, 24, 6]
    let satDif = 4
    let lightDif = 8
    return `hsl(${base[0]}, ${base[1] + satDif * level}%, ${base[2] + lightDif * level}%)`
}

const NavigationBar = (leftSection, rightSection) => {
    return new UIElement({
        display: "grid",
        align_items: "center",
        grid_template_columns: "auto min-content",
        padding: "1.2rem",
        background: basicColor(1),
        content: [
            new Wrapper(leftSection),
            new Wrapper(rightSection, {
                display: "flex",
                align_items: "center",
            })
        ]
    })
}

const NavButton = (label, action) => {
    return new Wrapper(label, {
        padding: "0.8rem 1.2rem",
        border_radius: "0.8rem",
        cursor: "pointer",
        onhover: elem => {
            elem.style.background = basicColor(2)
        }
    })
}

const appContent = [
    NavigationBar(
        [
            new Wrapper("Aaron Meche", {
                font_size: "1.6rem",
                font_weight: 600
            })
        ],
        [
            NavButton("Home"),
            NavButton("About")
        ]
    )
]

const ui = new Interface({
    "app": appContent
})