import { createRouter } from "./js/index.js"

const routes = import.meta.glob("./routes/**/+index.js")

createRouter(routes, {
    target: "#app",
    title: "Ginger UI"
}).start()
