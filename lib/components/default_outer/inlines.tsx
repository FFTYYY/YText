/** 
 * 这个模块提供一些默认的 Inline 的渲染器。
 * @module
 */

import React, {useState} from "react"

import { Node, Editor } from "slate"

import Button       from "@mui/material/Button"
import Card         from "@mui/material/Card"
import TextField    from "@mui/material/TextField"
import Grid         from "@mui/material/Grid"
import CardHeader   from "@mui/material/CardHeader"
import Menu         from "@mui/material/Menu"
import MenuItem     from "@mui/material/MenuItem"
import Drawer       from "@mui/material/Drawer"
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import ButtonGroup from '@mui/material/ButtonGroup'
import CodeIcon from '@mui/icons-material/Code'
import FilterVintageIcon from '@mui/icons-material/FilterVintage';
import IconButton from '@mui/material/IconButton'
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import {Paper} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

import { InlineStyle , EditorCore} from "../../core/editor_core"
import { InlineNode , StyledNode } from "../../core/elements"
import type { EditorRenderer_Func , EditorRenderer_Props } from "../../editor_interface"
import { YEditor } from "../../editor_interface"

import { non_selectable_prop , is_same_node} from "../../utils"
import { DefaultHidden } from "./hidden"
import { DefaultParameterEditButton , DefaultCloseButton } from "./universe"
import { AutoStackedPopper , SimpleAutoStack , UniversalComponent_Props , AutoTooltip , } from "./universe"

export { get_DefaultInline }


function get_DefaultInline(
    rightbar_extra: (props: UniversalComponent_Props) => any = (props:UniversalComponent_Props) => <></>
): EditorRenderer_Func{
    return (props: EditorRenderer_Props) => {
        let element = props.element as InlineNode
        let editor  = props.editor
        let E = rightbar_extra

        // 展开栏挂载的元素。
        let [menu_anchor, set_menu_anchor] = React.useState<null | HTMLElement>(null)

        const expand_button = <Box {...non_selectable_prop}><SimpleAutoStack force_direction="column">
            <E editor={editor} element={element}/>
            <AutoTooltip title = "展开"><IconButton 
                onClick = {e => set_menu_anchor(menu_anchor == undefined ? e.currentTarget : undefined)}
                size = "small"
            ><KeyboardArrowDownIcon /></IconButton></AutoTooltip>
            <AutoStackedPopper 
                anchorEl = {menu_anchor} 
                open = {menu_anchor != undefined}
            >
                <Typography>{element.name}</Typography>
                <DefaultParameterEditButton editor={editor} element={element}/>
                <DefaultHidden      editor={editor} element={element} />
                <DefaultCloseButton editor={editor} element={element} />
            </AutoStackedPopper>
        </SimpleAutoStack></Box>


        return <Box component="span" {...props.attributes}><Paper 
            sx={{
                backgroundColor: "#AABBCC" , 
                display: "inline-block" , 
            }}
        >
            <Grid container columns={24}>
                <Grid item xs={21} md={22} xl={23}>{props.children}</Grid>
                <Grid item xs={3}  md={2}  xl={1}>{expand_button}</Grid>
            </Grid>
        </Paper></Box>
    }
}
