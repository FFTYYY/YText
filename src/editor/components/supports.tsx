export {}

// import { SupportNode } from "../core/elements"
// import { SupportStyle , EditorCore} from "../core/editor/editor_core"
// import type { Renderer_Func , Renderer_Props } from "../core/editor/editor_interface"
// import { YEditor } from "../core/editor/editor_interface"
// import Button from '@mui/material/Button';
// import { Transforms , Node } from "slate"

// interface SupportComponent{
//     style: SupportStyle
//     editor_renderer: Renderer_Func
// }

// function newparagraph(editor: YEditor, name:string = "newparagraph" , words: string = "New Graph"){
//     let style = new SupportStyle(name , {})
//     let editor_renderer = (props: Renderer_Props) => {
//         return <Button
//             onClick = { e => {return Transforms.insertNodes(
//                 editor.slate , ParagraphPrototype() , {at: Node2Path(editor.core.root , props.element)}
//             )}}
//         >{words}</Button>
//     }

//     return [style , editor_renderer]
// }

