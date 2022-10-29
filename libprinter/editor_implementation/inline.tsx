/** 
 * 这个模块提供一些默认的 Inline 的渲染器。
 * @module
 */

import React, {useState} from "react"


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

import {
    InlineNode , 
    ConceptNode , 
} from "../core"

import {
    EditorRenderer , 
    EditorRendererProps, 
} from "../editor"

import { 
    DefaultParameterEditButton , 
    DefaultCloseButton , 
    AutoStackedPopperWithButton, 
    AutoStackedPopperButtonGroupMouseless, 
} from "./buttons"

import { DefaultEditAbstractButton, DefaultNewAbstract, DefaultNewAbstractButton } from "./abstract"
import { EditorButtonInformation , } from "./buttons"
import { AutoStackedPopper , SimpleAutoStack , AutoStack , AutoTooltip  } from "./uibase"
import { 
    EditorComponentPaper as ComponentPaper , 
    EditorParagraphBox as ParagraphBox , 
    EditorBackgroundPaper as BackgroundPaper , 
    EditorComponentEditingBox as ComponentEditorBox , 
    EditorUnselecableBox as UnselecableBox , 
    EditorComponentBox as ComponentBox , 
    EditorStructureTypography as StructureTypography , 
} from "./uibase"

export { get_default_inline_editor }

/** 默认的内联样式渲染器。
 * @remark 现在有个bug，在内联节点的末尾输入中文的时候会出错。
 * 见https://github.com/ianstormtaylor/slate/issues/4811
 */
function get_default_inline_editor({
    get_label       = (n: InlineNode)=>(n.parameters["label"] && n.parameters["label"].val) as string, 
    surrounder      = (props) => <React.Fragment>{props.children}</React.Fragment> , 
    rightbar_extra  = (props) => <></> , 
}: {
    get_label       ?: (n: InlineNode)=>string , 
    surrounder      ?: (props: EditorButtonInformation & {children: any}) => any , 
    rightbar_extra  ?: (props: EditorButtonInformation) => any  , 

}): EditorRenderer<InlineNode>{
    return (props: EditorRendererProps<InlineNode>) => {
        let node = props.node as InlineNode
        let label   = get_label(node)
        let Extra = rightbar_extra
        let SUR = surrounder

        return <ComponentPaper is_inline>
            <AutoStack force_direction="row">
                <ComponentEditorBox>
                    <SUR node={node}>{props.children}</SUR>
                </ComponentEditorBox>
                <UnselecableBox>
                    <AutoStack force_direction="row">
                        <Extra node={node}/>
                        <AutoStackedPopperButtonGroupMouseless
                            node = {node}
                            idxs = {[0]}
                            close_on_otherclick
                            outer_button = {IconButton}
                            outer_props = {{
                                sx: {
                                    height: "1rem" , 
                                    width: "1rem" , 
                                    margin: "0",
                                } , 
                                children: <KeyboardArrowDownIcon sx={{height: "1rem"}}/> ,
                            }} 
                            label = {"展开" + (label ? ` / ${label}` : "") }
                            buttons = {[
                                DefaultParameterEditButton , 
                                DefaultCloseButton , 
                                DefaultNewAbstractButton , 
                                DefaultEditAbstractButton , 
                            ]}
                        >
                            <Typography>{label}</Typography>
                        </AutoStackedPopperButtonGroupMouseless>
                    </AutoStack>
                </UnselecableBox>
            </AutoStack>
        </ComponentPaper>
    }
}
