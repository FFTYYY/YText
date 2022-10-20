/** 这个模块给编辑器提供一些实用工具。 */
import Slate from "slate"

import {
    Node ,
    ConceptNode ,
} from "../core"

export {
    is_same_node , 
    node2path , 
}

/** 判断两个节点是否为同一个节点。这个函数会直接比较创建节点时分配的节点`idx`。 */
function is_same_node(node1: Slate.Node, node2: Slate.Node): boolean{
    if(node1["idx"] == undefined || node2["idx"] == undefined)
        return false
    return node1["idx"] == node2["idx"]
}

/** 获得一个节点在节点树中的路径。 */
function node2path(root: Slate.Node, node: Slate.Node): number[] | undefined{
    if(is_same_node(root , node)){
        return []
    }
    /** 如果根节点不存在子节点，那么自然无法向下查找。 */
    if(root["children"] == undefined){
        return undefined
    }
    root = root as {children: Slate.Node[]}
    for(let subidx in root.children){
        let ret = node2path(root , node)
        if(ret != undefined){
            return [parseInt(subidx) , ...ret]
        }
    }
    return undefined
}
