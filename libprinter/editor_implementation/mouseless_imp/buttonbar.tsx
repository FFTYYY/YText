import React  from "react"

import {
    EditorComponent , 
} from "../../editor"
import {
    AllConceptTypes , 
} from "../../core"

import {
    MouselessElement , 
    DirectionKey, 
} from "./../mouseless"

export {
    SPACE , 
    get_mouseless_space , 
    get_position , 
    get_run , 
}

const SPACE = "q"
const TYPENAMES = ["group" , "inline" , "support" , "structure"]

function get_mouseless_space(editor: EditorComponent){
    return {
        key: SPACE, 
        activate_position: get_activate_position() , 
        switch_position: get_switch_position(editor) , 
    }
}


function get_position(typename: Exclude<AllConceptTypes, "abstract">, idx: number){
    let typeidx = TYPENAMES.indexOf(typename)
    return JSON.stringify([typeidx, idx])
}

function get_run(editor: EditorComponent, typename: Exclude<AllConceptTypes, "abstract">, pos_y: number){
    return ()=>{
        let concept_names = Object.keys( editor.get_core().renderers[typename] )
        let concept_name = concept_names[pos_y]
        editor.new_concept_node(typename , concept_name)
    }
} 

function get_activate_position(){
    return (position_list: string[], cur_position: string): string | undefined => {
        if(cur_position != undefined){ // 如果之前已经选过值了，那就用之前的值。
            return cur_position
        }
        if(position_list.length == 0){
            return undefined
        }
        let positions = position_list.reduce((s,x)=>[...s, JSON.parse(x)], [])
        positions.sort((a: [number,number],b: [number,number])=>(a[0] == b[0]) ? (a[1] - b[1]) : (a[0] - b[0]))
        return JSON.stringify(positions[0]) // 最小的那个。
    }
} 

/** 这个函数以editor为参数，返回改变位置的函数。 */
function get_switch_position(editor: EditorComponent){
    if(editor == undefined){
        return ()=>undefined
    }
    return (position_list: string[], cur_position: string, direction: DirectionKey) => {
        if(cur_position == undefined){ // 如果都没有选中过位置，那就用最小的。
             return get_activate_position()(position_list, cur_position)
        }
        let xmax = TYPENAMES.length

        let [pos_x , pos_y]: [number , number] = JSON.parse(cur_position)
        if(direction == "ArrowUp"){
            pos_x --
        }
        else if(direction  == "ArrowDown"){
            pos_x ++
        }
        pos_x = ((pos_x % xmax) + xmax) % xmax
        
        let typename = TYPENAMES[pos_x]
        let ymax = Object.keys( editor.get_core().renderers[typename] ).length // TODO renderers?
        if(direction == "ArrowLeft"){
            pos_y --
        }
        else if(direction  == "ArrowRight"){
            pos_y ++ 
        }
        pos_y = ((pos_y % ymax) + ymax) % ymax

        return JSON.stringify([pos_x, pos_y])
    }
}

