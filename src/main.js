import { createRouter } from "$lib"
import "./static/main.css"

const routes = import.meta.glob("./routes/**/+index.js")
const layouts = import.meta.glob("./routes/**/+layout.js")

createRouter(routes, {
    layouts,
    target: "#app",
    title: "Ginger UI"
}).start()
