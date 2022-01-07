import { GroupNode , GroupPrototype , ParagraphPrototype} from "../core/elements"
import { GroupStyle , EditorCore} from "../core/editor/editorcore"
import type { Renderer_Func , Renderer_Props } from "../core/editor/editor_interface"
import { YEditor } from "../core/editor/editor_interface"
import { Button } from "antd"
import { Transforms , Node } from "slate"
import { Node2Path } from "./utils"

export {theorem}

function theorem(editor: YEditor, name:string = "theorem"){
    let style = GroupStyle(name , {
        "words": "Theorem"
    })

    let renderer = (props:Renderer_Props) => <Card {...props.attributes}>{props.parameters.words}: {props.children}</Card>

    return [style , renderer]
}