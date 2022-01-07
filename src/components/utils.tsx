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