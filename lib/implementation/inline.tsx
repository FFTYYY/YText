import React, { ReactComponentElement } from "react"

import {
    Typography , 
    Box , 
    Paper , 
    Grid , 
} from "@mui/material"
import type {
    TypographyProps , 
    PaperProps , 
    BoxProps , 
} from "@mui/material"


import {
    Printer , 
    ProcessedParameterList , 
    ConceptNode , 
    GroupNode , 
    PrinterRenderFunctionProps , 
    PrinterRenderFunction , 
    PrinterRenderer , 
    Env , 
    Context, 
    ParagraphNode, 
    InlineNode , 
} from "../core"
import {
    ContexterBase , 
    InjectContexter , 
    ConsumerContexter , 
    InjectInformation , 
} from "./contexter"
import { 
    PrinterPartBox , 
    PrinterParagraphBox, 
} from "./uibase/components"
import {
    auto_renderer , 
} from "./utils"
export {get_default_inline_renderer}


/**
 * 这个函数帮助用户生成一个行内一级概念的渲染器。
 * @param params.contexters 要使用的上下文工具列表。
 * @param params.outer 包裹内容的一个容器。
 * @returns 
 */
function get_default_inline_renderer({
    contexters = [] , 
    outer = (props: PrinterRenderFunctionProps<InlineNode>)=><span>{props.children}</span>  , 
}:{
	contexters?: ContexterBase<InlineNode>[] ,
	outer     ?: PrinterRenderFunction
}){ 

    let OUT = outer

    return auto_renderer({
        contexters: contexters , 
        render_function: (props: PrinterRenderFunctionProps<InlineNode>) => {
            let props_except_children = {
                node: props.node , 
                context: props.context , 
                parameters: props.parameters ,             
            }
            return <OUT {...props_except_children}>{props.children}</OUT>
        }
    })
}