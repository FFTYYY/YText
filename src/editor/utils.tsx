import { Node } from "slate"
import { is_styled } from "./core/elements"
import React from "react"

/** 给一个组件分配这个prop可以防止其被slate视为文本 */ 
const non_selectable_prop = {
    style: { userSelect: "none" } as React.CSSProperties,
    contentEditable: false , 
}

function is_same_node(node1: Node, node2: Node): boolean{
    if((!is_styled(node1)) || (!is_styled(node2)))
        return false
    return node1.idx == node2.idx
}

export { non_selectable_prop , is_same_node}