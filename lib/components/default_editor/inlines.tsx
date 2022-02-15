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
import type { EditorRenderer_Func , EditorRenderer_Props } from "../../editor"
import { YEditor } from "../../editor"

import { is_same_node} from "../../utils"
import { DefaultHidden } from "./hidden"
import { DefaultParameterEditButton , DefaultCloseButton } from "./universe"
import { UniversalComponent_Props , } from "./universe"
import { AutoStackedPopper , SimpleAutoStack , AutoStack , AutoTooltip  } from "./basic"
import { AutoStackedPopperWithButton } from "./universe"
import { InlineComponentPaper , UnselecableBox , ComponentEditorBox } from "./basic"

export { get_DefaultInline }


function get_DefaultInline(
    rightbar_extra: (props: UniversalComponent_Props) => any = (props:UniversalComponent_Props) => <></>
): EditorRenderer_Func{
    return (props: EditorRenderer_Props) => {
        let element = props.element as InlineNode
        let editor  = props.editor
        let Extra = rightbar_extra

        return <InlineComponentPaper>
            <AutoStack force_direction="row">
                <ComponentEditorBox>{props.children}</ComponentEditorBox>
                <UnselecableBox>
                    <AutoStack force_direction="row">
                        <Extra editor={editor} element={element}/>
                        <AutoStackedPopperWithButton
                            close_on_otherclick
                            button_class = {IconButton}
                            button_props = {{
                                sx: {
                                    height: "1rem" , 
                                    width: "1rem" , 
                                    margin: "0",
                                } , 
                                children: <KeyboardArrowDownIcon sx={{height: "1rem"}}/> ,
                            }} 
                            title = "展开"
                        >
                            <Typography>{element.name}</Typography>
                            <DefaultParameterEditButton editor={editor} element={element}/>
                            <DefaultHidden      editor={editor} element={element} />
                            <DefaultCloseButton editor={editor} element={element} />
                        </AutoStackedPopperWithButton>
                    </AutoStack>
                </UnselecableBox>
            </AutoStack>
        </InlineComponentPaper>
    }
}
