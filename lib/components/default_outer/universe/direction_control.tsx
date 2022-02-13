/** 
 * 这个模块提供一些基础组件。
 * @module
 */

import React, {useState} from "react"

import Card         from "@mui/material/Card"
import TextField    from "@mui/material/TextField"
import Drawer       from "@mui/material/Drawer"
import CloseIcon from '@mui/icons-material/Close';
import Portal from '@mui/material/Portal';
import Button from '@mui/material/Button';
import { Typography , Paper } from '@mui/material';
import Popper from '@mui/material/Popper';

import { StyledNode } from "../../../core/elements"
import { GroupStyle , EditorCore} from "../../../core/editor_core"
import { YEditor } from "../../../editor_interface"
import { HiveTwoTone } from "@mui/icons-material"
import { non_selectable_prop , is_same_node , node2path } from "../../../utils"
import { Node, Editor } from "slate"
import IconButton from '@mui/material/IconButton';
import { set_node , delete_node } from "../../../behaviours"
import { styled } from '@material-ui/styles';
import { Tooltip , Stack } from '@mui/material';
import type { TooltipProps , ButtonProps , PaperProps } from '@mui/material';

import SettingsIcon from '@mui/icons-material/Settings';
import SettingsApplicationsOutlinedIcon from '@mui/icons-material/SettingsApplicationsOutlined';
import SettingsApplicationsTwoToneIcon from '@mui/icons-material/SettingsApplicationsTwoTone';

export {AutoTooltip  , Direction , AutoStack , SimpleAutoStack , AutoStackedPopper}

type DirectionValues = "row" | "column"

/** 这个上下文对象指示一个元素以何种方向布局。 */
const Direction = React.createContext<DirectionValues>("row");


/** 这个元素创建一个为一个对象创建 Tooltip ，但是会自动决定方向。 */
const AutoTooltip = (props: {
    title?: string, 
    children?: any , 
}) => {
    let title = props.title || ""
    return <Direction.Consumer>{nowdir => { 
        return <Tooltip title={title} placement={nowdir == "row" ? "left" : "top"}>
            {props.children}
        </Tooltip>
    }}</Direction.Consumer>
}


/** 这个组件用于创建一个自动堆叠的对象。 */
function AutoStack(props: {
    force_direction?: DirectionValues
    children?: any
}){
    let subcomponent = (nowdir: DirectionValues) => {
        return <Direction.Provider value={nowdir == "row" ? "column" : "row"}><Stack direction={nowdir}>{
            props.children
        }</Stack></Direction.Provider>
    }
    
    if(props.force_direction != undefined){
        return subcomponent(props.force_direction)
    }

    return <Direction.Consumer>{nowdir => subcomponent(nowdir)}</Direction.Consumer> 
}

/** 这个组件自动堆叠组件不会自动翻转方向。 */
function SimpleAutoStack(props: {
    force_direction?: DirectionValues
    children?: any
}){
    let subcomponent = (nowdir: DirectionValues) => {
        return <Direction.Provider value={nowdir}><Stack direction={nowdir}>{
            props.children
        }</Stack></Direction.Provider>
    }
    
    if(props.force_direction != undefined){
        return subcomponent(props.force_direction)
    }
    return <Direction.Consumer>{nowdir => subcomponent(nowdir)}</Direction.Consumer> 
}

/** 创建一个 Popper 对象，但其会自动按照当前方向布局。 */
function AutoStackedPopper(props:{
    force_direction?: DirectionValues
    children?: any
    force_flip?: boolean
    anchorEl: any , 
    open: boolean , 
    container?: any
}){
    let force_flip = props.force_flip != undefined ? props.force_flip : true
    let S = SimpleAutoStack //不自动翻转方向
    if(force_flip)
        S = AutoStack // 自动翻转方向
    
    let C = props.container || Paper

    let subcomponent = (nowdir: DirectionValues) => <Popper 
            anchorEl = {props.anchorEl} 
            open = {props.open}
            placement = {nowdir == "row" ? "right" : "bottom"}
        >
        <C><S>
            {props.children}
        </S></C>
    </Popper>

    if(props.force_direction != undefined){
        return subcomponent(props.force_direction)
    }
    return <Direction.Consumer>{nowdir => subcomponent(nowdir)}</Direction.Consumer> 
}