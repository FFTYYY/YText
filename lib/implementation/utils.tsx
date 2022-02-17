import { Node , Path } from "slate"
import { is_styled , StyledNode , GroupNode } from "../core/elements"
import React from "react"

export { 
    is_same_node , 
    node2path , 
    get_hidden_idx , 
    update_kth , 
    object_foreach , 
    merge_object , 
}

/** 询问一个节点在另一个节点的 hidden 数组中的位置。 */
function get_hidden_idx(fathernode: StyledNode, sonnode: GroupNode){
    for(let i = 0; i < fathernode.hiddens.length;i++){
        if(is_same_node(fathernode.hiddens[i],sonnode))
            return i
    }
    return -1
}

/** 对对象的每个值进行操作，返回一个新的对象。 */
function object_foreach(obj: any , func: (o:any)=>any){
    let ret = {}
    for(let k in obj){
        ret[k] = func(obj[k])
    }
    return ret
}

/** 返回一个 list 修改了第 k 个元素后的版本。 */
function update_kth(li: any[], k: number, new_k: any){
    return [...li.slice(0,k) , ...[new_k] , ...li.slice(k+1,li.length)]
}

/** 判断两个节点是否为同一个节点。这个函数会直接比较创建节点时分配的节点 idx 。 */
function is_same_node(node1: Node, node2: Node): boolean{
    if((!is_styled(node1)) || (!is_styled(node2)))
        return false
    return node1.idx == node2.idx
}

// TODO：这个函数的实现太沙雕了，应该换一个更有效率的实现。
/** 获得一个节点在节点树中的路径。 */
function node2path(root: Node, node: Node): Path{
    for(let [nd , path] of Node.descendants(root)){
        if(is_same_node(nd,node)){
            return path
        }
    }
    return undefined
}

// 递归合并两个对象的每一项。
function merge_object(obj_1: any, obj_2: any){
    if(obj_1 == undefined)
        return obj_2
    if(obj_2 == undefined)
        return obj_1
    
    // 但凡遇到叶子节点，优先以obj_2为准
    if(typeof obj_2 == "string" || typeof obj_2 == "number" || typeof obj_2 == "boolean"){
        return obj_2
    }
    // 但凡遇到叶子节点，就返回。
    if(typeof obj_1 == "string" || typeof obj_1 == "number" || typeof obj_1 == "boolean"){
        return obj_1
    }

    let ret = {}
    for(let key in {...obj_1,...obj_2}){
        ret[key] = merge_object(obj_1[key] , obj_2[key])
    }
    return ret
}