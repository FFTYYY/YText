/** 这个模块给`EditorComponent`提供一系列mixins，来实现所有操作节点树的操作。 
 * @module
*/
import Slate from "slate"

import { EditorComponent } from "./main"
import {
    ConceptNode,
    Node , 
    ParameterList , 
    GroupNode , 

    is_concetnode , 
    is_paragraphnode , 
} from "../core"
import {
    UnexpectedParametersError
} from "../exceptions"

export { 
    get_node_by_path , 
    get_node_path_by_idx , 
    get_node_by_idx , 
    set_node_by_path , 
    set_node_by_idx , 
    set_node , 
    set_node_parameters , 
    delete_node_by_path , 
    delete_node_by_idx , 
    insert_node , 
    insert_nodes , 
    insert_nodes_before , 
    insert_nodes_after , 
    move_node , 
    move_node_by_path , 
    replace_nodes , 
}

function get_node_by_path<NodeType extends Node = Node , RootType extends Node = GroupNode>(root: RootType , path: number[]): NodeType | undefined{
    if(path.length == 0)
        return root as any as NodeType
    if(is_concetnode(root) || is_paragraphnode(root)){
        if(root.children.length >= path[0]){ // TODO >=?
            return get_node_by_path( root.children[path[0]] , path.slice(1)  )
        }
    }
    return undefined
}

function get_node_path_by_idx<NodeType extends Node = Node , RootType extends Node = GroupNode>(root: RootType , idx: number): number[]| undefined{
    if(root["idx"] == idx)
        return []
    if(is_concetnode(root) || is_paragraphnode(root)){
        for(let subidx in root.children){
            let c = root.children[subidx]
            let ret = get_node_path_by_idx<NodeType , Node>(c , idx)
            if(ret != undefined)
                return [parseInt(subidx) , ...ret]
        }
    }
    return undefined
}


function get_node_by_idx<NodeType extends Node = Node , RootType extends Node = GroupNode>(root: RootType , idx: number): NodeType | undefined{
    if(root["idx"] == idx)
        return root   as any as NodeType
    if(is_concetnode(root) || is_paragraphnode(root)){
        for(let c of root.children){
            let ret = get_node_by_idx<NodeType , Node>(c , idx)
            if(ret != undefined)
                return ret
        }
    }
    return undefined
}

/** 这个函数修改特定路径的节点。 */
function set_node_by_path<NodeType extends Node , RootType extends Node = GroupNode>(root: RootType , path: number[] , new_val: Partial<NodeType>){
    let node = get_node_by_path(root , path)
    if(node == undefined)
        return false
    Object.assign(node , new_val)
    return true
}

/** 这个函数根据`idx`查找节点并修改之。 */
function set_node_by_idx<NodeType extends Node , RootType extends Node = GroupNode>(root: RootType , idx: number , new_val: Partial<NodeType>){
    let node = get_node_by_idx(root , idx)
    if(node == undefined)
        return false
    Object.assign(node , new_val)
    return true
}

function set_node<NodeType extends ConceptNode , RootType extends Node = GroupNode>(root: RootType, targetnode: NodeType, new_val: Partial<NodeType>){
    if(!is_concetnode(targetnode)){ // 这个函数只能用来设置概念节点
        return false
    }
    return set_node_by_idx(root , targetnode.idx , new_val)
}

function set_node_parameters<NodeType extends ConceptNode , RootType extends Node = GroupNode>(root: RootType, targetnode: NodeType, parameters: ParameterList){
    if(!is_concetnode(targetnode)){ // 这个函数只能用来设置概念节点
        return false
    }
    let node = get_node_by_idx<NodeType, RootType>(root, targetnode.idx)
    if(node == undefined)
        return false
    node.parameters = {...node.parameters, ...parameters}
    return true
}

function delete_node_by_path(root: Node, path: number[]){
    if(path.length == 0){
        throw new UnexpectedParametersError("the path.length in delete_node_by_path() can not be 0")
    }
    let father_path = path.slice(0,path.length-1)
    let subidx = path[path.length-1]
    let father_node = get_node_by_path(root , father_path)
    if(father_node == undefined){
        return false
    }
    if(is_concetnode(father_node) || is_paragraphnode(father_node)){
        if(father_node.children.length > subidx){
            father_node.children.splice(subidx , 1)
            return true
        }
    }
    return false
}

function delete_node_by_idx(root: Node, idx: number){
    let path = get_node_path_by_idx(root , idx)
    if(path == undefined || path.length == 0){
        return false
    }
    return delete_node_by_path(root , path)
}

function insert_node<NodeType extends Node = Node>(root: Node, node: NodeType, path: number[]){
    if(path.length == 0){
        throw new UnexpectedParametersError("the path.length in insert_node() can not be 0")
    }
    let father_path = path.slice(0,path.length-1)
    let subidx = path[path.length-1]
    let father_node = get_node_by_path(root , father_path)
    if(father_node == undefined){
        return false
    }
    if(is_concetnode(father_node) || is_paragraphnode(father_node)){
        (father_node.children as NodeType[]).splice(subidx , 0, node)
        return true
    }
    return false
}
function insert_nodes<NodeType extends Node = Node>(root: Node, nodes: NodeType[], path: number[]){
    if(path.length == 0){
        throw new UnexpectedParametersError("the path.length in insert_node() can not be 0")
    }
    let father_path = path.slice(0,path.length-1)
    let subidx = path[path.length-1]
    let father_node = get_node_by_path(root , father_path)
    if(father_node == undefined){
        return false
    }
    if(is_concetnode(father_node) || is_paragraphnode(father_node)){
        (father_node.children as NodeType[]).splice(subidx , 0, ...nodes)
        return true
    }
    return false
}

function insert_nodes_before<NodeType extends Node = Node>(root: Node, nodes: NodeType[], target_node: ConceptNode){
    let path = get_node_path_by_idx(root , target_node.idx)
    if(path == undefined){
        return false
    }
    return insert_nodes(root, nodes, path )
}

function insert_nodes_after<NodeType extends Node = Node>(root: Node, nodes: NodeType[], target_node: ConceptNode){
    let path = get_node_path_by_idx(root , target_node.idx)    
    if(path == undefined){
        return false
    }
    path[path.length-1] ++
    return insert_nodes(root, nodes, path)
}

function move_node(root: Node, target_node: ConceptNode, position: number[]){
    let temporary_idx = Math.floor(Math.random() * 233333) //给要插入的节点制造一个临时idx。
    let old_idx = target_node.idx
    let to_insert = {...target_node, idx: temporary_idx}

    if(!insert_node(root , target_node , position)){ // 总之先插入
        return false
    }
    if(!delete_node_by_idx(root , target_node.idx)){ // 总之把之前的节点删掉，关我屁事。
        return false
    }
    to_insert.idx = old_idx // 总之把idx改回来。
    return true
}

function move_node_by_path(root: Node, from_path: number[], to_path: number[]){
    let node = get_node_by_path(root, from_path)
    if(node == undefined || !is_concetnode(node)){
        return false
    }
    return move_node(root, node , to_path)
}

/** 这个函数把某个节点的全部子节点替换成给定节点。 */
function replace_nodes<FatherType extends ConceptNode>(root: Node, father_node: FatherType, new_children: FatherType["children"]){

    let father = get_node_by_idx(root, father_node.idx)
    if(!is_concetnode(father)){
        return false
    }
    father.children = new_children
    return true
}

