import { SupportNode , SupportPrototype , ParagraphPrototype} from "../core/elements"
import { SupportStyle , EditorCore} from "../core/editor/editorcore"
import type { Renderer_Func , Renderer_Props } from "../core/editor/editor_interface"
import { YEditor } from "../core/editor/editor_interface"
import { Button } from "antd"
import { Transforms } from "slate"


interface SupportComponent{
    style: SupportStyle
    editor_renderer: Renderer_Func
}

function newparagraph(editor: YEditor, name:string = "newparagraph" , words: string = "New Graph"){
    let style = new SupportStyle(name , {})
    let editor_renderer = (props: Renderer_Props) => {
        return <Button
            onClick = { e => {return Transforms.insertNodes(
                editor.slate , ParagraphPrototype() , {at: props.element}
            )}}
        >{words}</Button>
    }
}


