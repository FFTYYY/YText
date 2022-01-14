import { Node , Path } from "slate"
import { is_styled , StyledNode} from "./core/elements"
import React from "react"

/** 给一个组件分配这个 prop 可以防止其被 slate 视为可编辑文本。
 */ 
const non_selectable_prop = {
    style: { userSelect: "none" } as React.CSSProperties,
    contentEditable: false , 
}

/** 判断两个节点是否为同一个节点。这个函数会直接比较创建节点时分配的节点 idx 。 */
function is_same_node(node1: Node, node2: Node): boolean{
    if((!is_styled(node1)) || (!is_styled(node2)))
        return false
    return node1.idx == node2.idx
}

function node2path(root: Node, node: Node): Path{
    for(let [nd , path] of Node.descendants(root)){
        if(is_same_node(nd,node)){
            return path
        }
    }
    return undefined
}

export { non_selectable_prop , is_same_node , node2path}