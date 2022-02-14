/** 
 * 这个文件提供一些实用按钮。
 * @module
 */

import React, {useState} from "react"

import { 
    Card , 
    TextField ,
    Drawer , 
    Portal , 
    Button , 
    Typography , 
    Tooltip , 
    IconButton , 
} from "@mui/material"
import type { IconButtonProps } from "@mui/material"

import {
    Close as CloseIcon , 
    Settings as SettingsIcon , 
}
from "@mui/icons-material"


import { delete_node } from "../../../behaviours"
import { AutoTooltip , Direction , AutoStack } from "./direction_control"
import { DefaultParameterWithEditorWithDrawer , UniversalComponent_Props } from "./parameter_container" 

export {    
    DefaultParameterEditButton , 
    DefaultCloseButton , 
}

/** 这个函数是一个语法糖，用于自动创建按钮 */
function AutoIconButton(props:{
    onClick?: IconButtonProps["onClick"]
    size?: IconButtonProps["size"]
    title?: string
    icon?: any
}){
    let Icon = props.icon
    return <AutoTooltip title={props.title}>
        <IconButton onClick={props.onClick} size={props.size}>
            <Icon/>
        </IconButton>
    </AutoTooltip>
}

/**
 * 这个组件向具体的编辑器和具体的节点提供 DefaultParameterContainer ，同时还提供一个按钮。
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.element 这个组件所服务的节点。
 * @param props.open 抽屉是否打开。
 * @param props.onClose 抽屉关闭时的行为。
 */
function DefaultParameterEditButton(props: UniversalComponent_Props & {
    onClose?: (e:any)=>void , 
}){
    let [ open , set_open ] = useState(false) // 抽屉是否打开
    let onClose = props.onClose || ((e:any)=>{})

    return <>
        <AutoIconButton onClick={e=>set_open(true)} title="设置参数" icon={SettingsIcon} />
        <DefaultParameterWithEditorWithDrawer 
            editor = {props.editor} 
            element = {props.element} 
            open = {open} 
            onClose = {e=>{ onClose(e); set_open(false); }} 
        />
    </>
}


/** 这个组件提供一个直接删除节点的按钮。 
 * @param props.editor 这个组件所服务的编辑器。
 * @param props.element 这个组件所服务的节点。
*/
function DefaultCloseButton(props: UniversalComponent_Props){
    return <AutoIconButton onClick={e=>{delete_node(props.editor , props.element)}} title="删除组件" icon={CloseIcon} />
}

function MyImg(props: {img_url: string}){
    return <img src={props.img_url}></img>
}