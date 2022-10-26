import * as SlateReact from "slate-react"
import {
    EditorComponent , 
} from ".."

import {
    set_inline , 
    set_support , 
} from "./set_metaparam"
import {
    EditorPlugin
} from "./base"

export { 
    with_ytext_plugin , 
}

export type {
    EditorPlugin , 
}

let plugins: EditorPlugin[] = [
    set_inline , 
    set_support
]


function with_ytext_plugin(editor: EditorComponent, slate: SlateReact.ReactEditor): SlateReact.ReactEditor{
    for(let plugin of plugins){
        slate = plugin(editor , slate)
    }
    return slate
}