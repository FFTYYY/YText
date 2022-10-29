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
    AbstractNode, 
    AllConceptTypes, 
} from "../core"

export {
    slate_is_concept , 
    slate_is_paragraph , 
    slate_is_text , 
    slate_concept_node2path , 
    slate_is_same_concept_node , 
    slate_get_node_type , 
    slate_concept_father , 
    slate_idx_to_node , 
}


function slate_is_concept(node: Slate.Node , type?: undefined | AllConceptTypes): node is Slate.Node & ConceptNode{
    if(type){
        return node["idx"] != undefined && node["type"] == type
    }
    return node["idx"] != undefined
}

function slate_is_paragraph(node: Slate.Node): node is Slate.Node & ParagraphNode{
    return (!slate_is_concept(node)) && (node["children"] != undefined) && (!Slate.Editor.isEditor(node))
}


function slate_is_text(node: Slate.Node): node is Slate.Node & TextNode{
    let flag = slate_is_concept(node) || slate_is_paragraph(node) || Slate.Editor.isEditor(node)
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
function slate_concept_node2path<RootType>(root: RootType & Slate.Node, node: Slate.Node & ConceptNode): Slate.Path{
    for(let [nd , path] of Slate.Node.descendants(root)){
        if(slate_is_same_concept_node(nd,node)){
            return path
        }
    }
    return undefined
}

/** 获得一个概念节点的最近的概念父亲节点。 */
function slate_concept_father<RootType = ConceptNode>(root: RootType & Slate.Node, node: Slate.Node & ConceptNode): (Slate.Node & ConceptNode) | undefined{
    let candicate: (Slate.Node & ConceptNode) | undefined = undefined
    for(let [nd,path] of Slate.Node.ancestors(root, slate_concept_node2path(root, node))){
        if(slate_is_concept(nd)){
            candicate = nd  // 因为`slate`按从上到下的顺序返回根节点，所以记录最后的匹配项。
                            // XXX 要依赖这一点吗....
        }
    }
    return candicate
}

function slate_idx_to_node<RootType = ConceptNode>(root: Slate.Editor, idx: number): (Slate.Node & ConceptNode) | undefined{
    let ret = Array.from( Slate.Editor.nodes(root, {match: (nd)=>nd["idx"] == idx}) )
    if(ret.length == 0){
        return undefined
    }
    return ret[0][0] as ConceptNode
}