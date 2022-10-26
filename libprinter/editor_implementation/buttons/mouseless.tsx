/**
 * 这个模块规定每个概念节点的按钮栏的无鼠标操作。
 * 约定：位置用`[节点编号,按钮编号]`来表示。
 * @module
 */

import React from "react"
import * as Slate from "slate"
import {
    ConceptNode
} from "../../core"
import {
    MouselessElement , 
    DirectionKey , 
} from "../mouseless"
import { 
    EditorComponent , 
    slate_is_concept , 
} from "../../editor"
import {
    EditorButtonInformation
} from "./base"

export {
    get_mouseless_space , 
    SPACE , 
    get_position , 
}

const SPACE = "x"

function get_mouseless_space(editor: EditorComponent){
    return {
        key: SPACE, 
        activate_position: get_activate_position(editor) , 
        switch_position: get_switch_position(editor) , 
    }
}

function get_position(node: Slate.Node & ConceptNode , idx: number){
    let node_idx = node.idx
    return JSON.stringify([node_idx, idx])
}

function get_switch_position(editor: EditorComponent){
    return (position_list: string[] , cur_position: string, direction: DirectionKey): string =>{
        if(cur_position == undefined){
            return get_activate_position(editor)(position_list, cur_position)
        }

        // 获得当前激活位置。
        let [now_idx, now_sub]: [number , number] = JSON.parse(cur_position)

        // 所选中的节点有哪些候选的位置。
        let cancidate_idx = position_list.reduce<number[]>((s,x)=>{
            let [nodeidx,subidx]: [number,number] = JSON.parse(x)
            if(nodeidx == now_idx){
                return [...s, subidx]
            }
            return s
        } , [])
        
        // 目前激活的按钮的编号的排名。
        let now_sub_idx = cancidate_idx.indexOf(now_sub)

        if(direction == "ArrowLeft"){
            now_sub_idx --
        }
        if(direction == "ArrowRight"){
            now_sub_idx ++
        }
        now_sub_idx = ((now_sub_idx % cancidate_idx.length) + cancidate_idx.length) % cancidate_idx.length
        let new_sub = cancidate_idx[now_sub_idx]

        return JSON.stringify([now_idx, new_sub])
    }
}

function get_activate_position(editor: EditorComponent){
    return (position_list: string[], cur_position: string): string => {
        let selection = editor.get_slate().selection
        if(!selection){ // 如果光标不在编辑器上
            return undefined
        }

        let now_path = selection.anchor.path // 如果光标在编辑器上，那么就选择光标开始位置作为当前节点。
        while(now_path.length > 0 && !slate_is_concept(Slate.Editor.node(editor.get_slate(), now_path)[0])){
            console.log(now_path)
            now_path = now_path.slice(0,now_path.length-1) // 反复向上寻找，直到找到一个概念节点。
        }
        let now_node = Slate.Editor.node(editor.get_slate(), now_path)[0]
        if(now_path.length == 0 || !slate_is_concept(now_node)){ // 如果退到了根节点，就退出。
            return undefined
        }
        let now_idx = now_node.idx
        console.log(now_idx, cur_position)

        if(cur_position != undefined){
            let [old_nodeidx, _] = JSON.parse(cur_position)
            if(old_nodeidx == now_idx){ // 如果还在之前的节点内，那么就保留原来的位置。
                return cur_position 
            }
        }

        // 所选中的节点有哪些候选的位置。
        let cancidate_idx = position_list.reduce((s,x)=>{
            let [nodeidx,subidx]: [number,number] = JSON.parse(x)
            if(nodeidx == now_idx){
                return [...s, subidx]
            }
            return s
        } , [])
        
        if(cancidate_idx.length == 0){ // 所选中的节点没有按钮。
            return undefined
        }
        
        cancidate_idx.sort()
        return JSON.stringify([now_idx, cancidate_idx[0]])
    }
}
