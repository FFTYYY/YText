/** 
 * 这个模块提供一些默认的 Inline 的渲染器。
 * @module
 */

import React, {useState} from "react"

import { Node, Editor } from "slate"

import {
    Grid , 
    Box , 
    Stack , 
    IconButton , 
    Typography , 
    Paper , 
} from "@mui/material"
import {
    KeyboardArrowDown as KeyboardArrowDownIcon , 
} from "@mui/icons-material"


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
