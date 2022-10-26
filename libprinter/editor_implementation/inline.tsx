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
    AutoStackedPopperWithButton , 
} from "./buttons"

import { 
    // TODO    
} from "./abstract"
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
    get_label       = (n: InlineNode)=>n["label"].val, 
    surrounder      = (props) => <React.Fragment>{props.children}</React.Fragment> , 
    rightbar_extra  = (props) => <></> , 
}: {
    get_label       ?: (n: InlineNode)=>string , 
    surrounder      ?: (props: EditorButtonInformation & {children: any}) => any , 
    rightbar_extra  ?: (props: EditorButtonInformation) => any  , 

}): EditorRenderer{
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
                            title = {"展开" + (label ? ` / ${label}` : "") }
                        >
                            <Typography>{label}</Typography>
                            <DefaultParameterEditButton     node={node}/>
                            {/* <DefaultAbstractEditorButtons   node={node} /> */}
                            <DefaultCloseButton             node={node} />
                        </AutoStackedPopperWithButton>
                    </AutoStack>
                </UnselecableBox>
            </AutoStack>
        </ComponentPaper>
    }
}
