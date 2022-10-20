import SlateReact from "slate-react"
import {
    EditorComponent , 
} from ".."

export type {
    EditorPlugin , 
}

type EditorPlugin = (editor: EditorComponent, slate: SlateReact.ReactEditor) => SlateReact.ReactEditor