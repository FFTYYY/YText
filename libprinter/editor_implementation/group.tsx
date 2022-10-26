/** 
 * 这个模块提供一些默认的 Group 的渲染器。
 * @module
 */

import React, {useState , createRef} from "react"


import {
    Typography , 
    Button , 
    Menu , 
    MenuItem , 
    Drawer , 
    AppBar , 
    Box , 
    AccordionDetails , 
    Popper , 
    Tooltip , 
    Switch , 
    Toolbar , 
    Paper , 
    Grid , 
    IconButton , 
    Divider  , 
    Container , 
} 
from "@mui/material"
import type {
    PaperProps
} 
from "@mui/material"

import {
    KeyboardArrowDown as KeyboardArrowDownIcon
} from "@mui/icons-material"


import * as Slate from "slate"

import { GroupNode  } from "../core"
import type { EditorRendererProps , EditorRenderer } from "../editor"

import { 
    DefaultParameterEditButton , 
    DefaultCloseButton , 
    AutoStackedPopperWithButton , 
    NewParagraphButtonUp , 
    NewParagraphButtonDown , 
    DefaultSwicth ,
    DefaultSoftDeleteButton , 

    EditorButtonInformation , 
} from "./buttons"

import { DefaultAbstractEditorButtons } from "./abstract"

import { AutoTooltip  , AutoStack , Direction , SimpleAutoStack , AutoStackedPopper} from "./uibase"
import { 
    EditorComponentPaper as ComponentPaper , 
    EditorParagraphBox as ParagraphBox , 
    EditorBackgroundPaper as BackgroundPaper , 
    EditorComponentEditingBox as ComponentEditorBox , 
    EditorUnselecableBox as UnselecableBox , 
    EditorComponentBox as ComponentBox , 
    EditorStructureTypography as StructureTypography , 
} from "./uibase"

import {
    ButtonGroup , 
    ButtonDescription , 
} from "./buttons"

export { get_deafult_group_editor_with_appbar , get_deafult_group_editor_with_rightbar}

/** 为 Group 类型的节点定制的 Paper ，在节点前后相连时会取消前后距离。 */
let GroupPaper = (props: PaperProps & {node: GroupNode}) => <ComponentPaper {...props} 
    sx = { props.node.relation == "chaining" ? { marginTop: "0" } : {} }
/>

/** 这个函数返回一个默认的带应用栏的 group 组件。用于比较大的 group 组件。
 * @param params.get_label 从参数列表获得 title 的方法。
 * @param params.appbar_extra 要额外向 appbar 里添加的组件。
 * @param params.surrounder 包裹内容区域的组件。
 * @returns 一个用于渲染group的组件。
 */
function get_deafult_group_editor_with_appbar({
    get_label       = (n:GroupNode)=>n.parameters["label"].val as string, 
    appbar_extra  = (n:GroupNode) => [] , 
    surrounder    = (props) => <>{props.children}</>
}: {
    get_label       ?: (n:GroupNode)=>string ,  
    appbar_extra    ?: (node: GroupNode) => ButtonDescription[], 
    surrounder      ?: (props: EditorButtonInformation & {children: any}) => any ,
}): EditorRenderer{
    // 渲染器
    return (props: EditorRendererProps<Slate.Node & GroupNode>) => {
        let node = props.node as GroupNode
        let label   = get_label(node)

        let E = appbar_extra
        let SUR = surrounder

        return <GroupPaper node={node}>
            <AutoStack force_direction="column">
                <UnselecableBox>
                    <Toolbar sx={{overflow: "auto"}}><AutoStack>
                        <StructureTypography>{label}</StructureTypography>
                        <ButtonGroup 
                            node = {node}
                            buttons = {[
                                DefaultParameterEditButton , 
                                // DefaultAbstractEditorButtons , 
                                DefaultSwicth , 
                                NewParagraphButtonUp , 
                                NewParagraphButtonDown , 
                                DefaultCloseButton , 
                                DefaultSoftDeleteButton , 
                                ... appbar_extra(node)
                            ]}
                        />
                    </AutoStack></Toolbar>
                </UnselecableBox >
                <Divider />
                <ComponentEditorBox autogrow>
                    <SUR node={node}>{props.children}</SUR>
                </ComponentEditorBox>
            </AutoStack>
        </GroupPaper>
    }
}

/** 这个函数返回一个默认的group组件，但是各种选项等都被折叠在右侧的一个小按钮内。用于比较小的group。
 * @param params.get_label 从参数列表获得title的方法。
 * @param params.rightbar_extra 要额外向添加的组件。
 * @param params.surrounder 包裹内容区域的组件。
 * @returns 一个用于渲染group的组件。
 */
function get_deafult_group_editor_with_rightbar({
    get_label       = (n:GroupNode)=>n.parameters["label"].val as string, 
    rightbar_extra  = (props) => <></> , 
    surrounder      = (props) => <>{props.children}</>
}: {
    get_label       ?: (n:GroupNode)=>string , 
    rightbar_extra  ?: (props: EditorButtonInformation) => any, 
    surrounder      ?: (props: EditorButtonInformation & {children: any}) => any ,
}): EditorRenderer{

    return (props: EditorRendererProps<Slate.Node & GroupNode>) => {
        let node = props.node as GroupNode
        let label   = get_label(node)
        let E = rightbar_extra
        let SUR = surrounder

        return <GroupPaper node={node}>
            <SimpleAutoStack force_direction="row">
                <ComponentEditorBox autogrow>
                    <SUR node={node}>{props.children}</SUR>
                </ComponentEditorBox>                
                <UnselecableBox sx={{textAlign: "center"}}>
                    <AutoStack>
                        <E node={node}/>
                        <StructureTypography variant="overline">{label}</StructureTypography>
                        <AutoStackedPopperWithButton
                            close_on_otherclick
                            button_class = {IconButton}
                            button_props = {{
                                size: "small" , 
                                children: <KeyboardArrowDownIcon fontSize="small"/> ,  
                            }}
                            title = "展开"
                        >
                            <DefaultParameterEditButton     node={node}/>
                            <DefaultAbstractEditorButtons   node={node} />
                            <DefaultSwicth                  node={node} />
                            <DefaultCloseButton             node={node} />
                            <DefaultSoftDeleteButton        node={node} />
                            <NewParagraphButtonUp             node={node} />
                        </AutoStackedPopperWithButton>
                    </AutoStack>
                </UnselecableBox>
            </SimpleAutoStack>
        </GroupPaper>
    }
}
