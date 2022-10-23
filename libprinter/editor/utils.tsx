/** 这个模块给编辑器提供一些实用工具。 */

import * as Slate from "slate"

import { 
    BadNodeError , 
} from "../exceptions"
import {
    Node ,
    ConceptNode ,
    ParagraphNode , 
    TextNode , 
    is_concetnode , 
    AllNodeTypes , 
    GroupNode , 
} from "../core"

export {
    slate_is_concept , 
    slate_is_paragraph , 
    slate_is_text , 
    slate_concept_node2path , 
    slate_is_same_concept_node , 
    slate_get_node_type , 
}

function slate_is_concept(node: Slate.Node): node is Slate.Node & ConceptNode{
    return node["idx"] != undefined
}

function slate_is_paragraph(node: Slate.Node): node is Slate.Node & ParagraphNode{
    return (!slate_is_concept(node)) && (node["children"] != undefined)
}


function slate_is_text(node: Slate.Node): node is Slate.Node & TextNode{
    let flag = slate_is_concept(node) || slate_is_paragraph(node)
    if(flag)
        return false
    if(node["text"] == undefined){
        throw new BadNodeError("can not determine know node type.")
    }
    return true
}

function slate_get_node_type(node: Slate.Node): AllNodeTypes{
    if(slate_is_text(node)){
        return "text"
    }
    if(slate_is_paragraph(node)){
        return "paragraph"
    }
    if(!slate_is_concept(node)){
        throw new BadNodeError("can not determine know node type.")
    }
    return node.type
}

/** 判断两个节点是否为同一个节点。这个函数会直接比较创建节点时分配的节点 idx 。 */
function slate_is_same_concept_node(node1: Slate.Node, node2: Slate.Node): boolean{
    if((!slate_is_concept(node1)) || (!slate_is_concept(node2)))
        return false
    return node1.idx == node2.idx
}

// TODO：这个函数的实现太沙雕了，应该换一个更有效率的实现。
/** 获得一个节点在节点树中的路径。 */
function slate_concept_node2path(root: Slate.Node & GroupNode, node: Slate.Node & ConceptNode): Slate.Path{
    for(let [nd , path] of Slate.Node.descendants(root)){
        if(slate_is_same_concept_node(nd,node)){
            return path
        }
    }
    return undefined
}
