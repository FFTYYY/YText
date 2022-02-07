/** 这个模块定义所有修改文档的外部行为。 
 * @module
*/
import { non_selectable_prop , is_same_node , node2path } from "./utils"
import { StyledNode } from "./core/elements"
import { Transforms, Node, Editor } from "slate"
import { YEditor } from "./editor_interface"

export { set_node , replace_nodes }

/** 这个函数修改节点的某个属性。相当于 slate.Transforms.setNodes */
function set_node(editor: YEditor, node: StyledNode, new_val: Partial<StyledNode>){
    let root = editor.core.root
    if(is_same_node(node,root)){
        
        editor.core.update_root(new_val) // root 是唯一可以直接修改的节点。
        Transforms.setNodes<StyledNode>(editor.slate , new_val , {at: []})
        return 
    }

    Transforms.setNodes<StyledNode>(editor.slate , new_val , {at: node2path(editor.slate , node)})
}

/** 这个函数把某个节点的全部子节点替换成给定节点。 */
function replace_nodes(editor: YEditor, nodes: Node[]){
    // TODO 哈哈

}