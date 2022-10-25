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
} from "./uibase"
import { 
    AutoStackButtons , 
} from "./uibase"
import {
    MouselessElement , 
    DirectionKey, 
} from "./mouseless"

import {
    SPACE , 
    get_mouseless_space , 
    get_position , 
    get_run , 
    get_activate_position , 
    get_switch_position , 
} from "./mouseless_imp/buttonbar"

export {
    DefaultButtonbar , 
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