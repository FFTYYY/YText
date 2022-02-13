/** 
 * 这个文件提供一些实用按钮。
 * @module
 */

import React, {useState} from "react"

import Card         from "@mui/material/Card"
import TextField    from "@mui/material/TextField"
import Drawer       from "@mui/material/Drawer"
import CloseIcon from '@mui/icons-material/Close';
import Portal from '@mui/material/Portal';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';

import { StyledNode } from "../../../core/elements"
import { GroupStyle , EditorCore} from "../../../core/editor_core"
import { YEditor } from "../../../editor_interface"
import { HiveTwoTone } from "@mui/icons-material"
import { non_selectable_prop , is_same_node , node2path } from "../../../utils"
import { Node, Editor } from "slate"
import IconButton from '@mui/material/IconButton';
import { set_node , delete_node } from "../../../behaviours"
import { styled } from '@material-ui/styles';
import { Tooltip } from '@mui/material';
import type { TooltipProps , ButtonProps , IconButtonProps } from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone';

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
    container?: any , 
}){
    let [ open , set_open ] = useState(false) // 抽屉是否打开
    let onClose = props.onClose || ((e:any)=>{})

    return <>
        <AutoIconButton onClick={e=>set_open(true)} title="设置参数" icon={SettingsIcon} />
        <Portal container={props.container}>
            <DefaultParameterWithEditorWithDrawer 
                editor = {props.editor} 
                element = {props.element} 
                open = {open} 
                onClose = {e=>{ onClose(e); set_open(false); }} 
            />
        </Portal>
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