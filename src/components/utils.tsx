import { BaseNode } from "../core/elements"
import { Path , Node } from "slate"

export { Node2Path }

function Node2Path(root: BaseNode, tar: BaseNode): Path{

    for(let [nd,pt] of Node.descendants(tar)){
        if(nd === tar){
            return pt
        }
    }

    return undefined
}

interface ComparableNode{
    nodekey: number
}
function isComaparable(n: Node): n is ComparableNode & Node{
    return (n as ComparableNode & Node).nodekey != undefined
}
function NodeEq(node1: Node, node2: Node){
    if( (node1 as ComparableNode & Node).nodekey != undefined){
    }
}