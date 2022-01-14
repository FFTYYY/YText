import { SupportNode , paragraph_prototype} from "../core/elements"
import { SupportStyle , EditorCore} from "../core/editor/editor_core"
import type { Renderer_Func , Renderer_Props } from "../core/editor/editor_interface"
import { YEditor } from "../core/editor/editor_interface"
import Button from '@mui/material/Button';
import { Transforms , Node } from "slate"
import { non_selectable_prop , is_same_node} from "../utils"
import { warning } from "../exceptions/warning";
import { node2path } from "../utils"
export {newparagraph}



function newparagraph(editor: YEditor, name:string = "newparagraph" , words: string = "New Graph"): [SupportStyle,Renderer_Func<SupportNode>]{
    let style = new SupportStyle(name , {})

    let renderer = (props: Renderer_Props<SupportNode>) => {
        return <div {...non_selectable_prop}><Button 
            {...props.attributes} 
            
            onClick = { e => {
                let my_path = node2path(editor.core.root , props.element) // 获取本节点的位置
                warning("节点不在节点树中！")
                // my_path[my_path.length - 1] ++ // 在下一个节点处插入
                Transforms.insertNodes(editor.slate , paragraph_prototype() , {at: my_path})
            }}
        >{words}</Button></div>
    }
    
    return [style , renderer]
}


