
import {
    StateStore,
    Wrapper
} from "$lib"

export const title = "Ginger UI"

const counter = new StateStore({})

export default function (link) {
    return new Wrapper("Bare Bones.", {
        padding: "2rem",
        font_size: "3rem",
        font_weight: "800",
        text_align: "center"
    })
}
