/** 这个模块描述默认实现的按钮栏。
 * 无鼠标操作的约定：所有位置用 JSON.stringify([number, number]) 表示，其中前一个表示行（0/1/2/3=组/行内/支持/结构），后一个表示第几个对象。
 * @module
 */
import React  from "react"

import {
    IconButton , 
    Button , 
    Paper ,
    Divider , 
} from "@mui/material"
import {
    CalendarViewDay as CalendarViewDayIcon , 
    CloseFullscreen as CloseFullscreenIcon , 
    Coffee as CoffeeIcon , 
    Settings as SettingsIcon , 
    QrCode as QrCodeIcon , 
} from "@mui/icons-material"
import { ThemeProvider , createTheme , styled } from "@mui/material/styles"
import type { Theme , ThemeOptions } from "@mui/material/styles"

import {
    EditorComponent , 
} from "../editor"
import {
    AllConceptTypes , 
} from "../core"

import { 
    AutoStackedPopperWithButton , 
} from "./buttons"
import { 
    AutoStackButtons , 
} from "./uibase"
import {
    MouselessElement , 
    DirectionKey, 
} from "./mouseless"


export {
    DefaultButtonbar , 
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

/** 这个组件是编辑器的右边工具栏的组件按钮部分。 */
function DefaultButtonbar(props: {editor: EditorComponent}){
    let editor = props.editor

    let icons = {
        group: CalendarViewDayIcon , 
        inline: CloseFullscreenIcon , 
        support: CoffeeIcon , 
        structure: QrCodeIcon , 
    }

    return <React.Fragment>
        {["group" , "inline" , "support" , "structure"].map ( (typename: Exclude<AllConceptTypes , "abstract">)=>{
            let Icon = icons[typename]
            return <React.Fragment key={typename}>
                <AutoStackedPopperWithButton
                    poper_props = {{
                        stacker: AutoStackButtons ,
                        component: styled(Paper)({backgroundColor: "#aabbddbb" , }) ,  
                    }}
                    button_class = {IconButton}
                    button_props = {{
                        children: <Icon /> , 
                    }}
                    title = {typename}
                >{
                    Object.keys( editor.get_core().renderers[typename] ).map( (stylename , idx) => 
                        <MouselessElement 
                            key = {idx}
                            space = {SPACE}
                            position = {get_position(typename, idx)}
                            run = {get_run(editor, typename, idx)}
                        >
                            <Button 
                                onClick = {e => editor.new_concept_node(typename , stylename)}
                                variant = "text"
                            >
                                {stylename}
                            </Button>
                            <Divider orientation="vertical" flexItem/>
                        </MouselessElement>
                    )
                }</AutoStackedPopperWithButton>
            </React.Fragment>
        })}
    </React.Fragment>
}