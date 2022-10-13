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
} from "./basic/components"

export {get_default_inline_renderer}

function get_default_inline_renderer<NodeType extends Node>({
    contexters = [] , 
    outer = (props: PrinterRenderFunctionProps)=><span>{props.children}</span>  , 
}:{
	contexters?: ContexterBase[] ,
	outer     ?: PrinterRenderFunction
}){ 

    let OUT = outer

    return new PrinterRenderer({
        enter: (node: Readonly<GroupNode>, parameters: Readonly<ProcessedParameterList>, env: Env, context: Context)=>{
            for(let cer of contexters){
                cer.enter(node,parameters,env,context)
            }
        } , 
        exit: (node: Readonly<GroupNode>, parameters: Readonly<ProcessedParameterList>, env: Env, context: Context)=>{
            let cache = {} // TODO 这个没有真正地被处理
            let flag = true
            for(let cer of contexters){
                let [subcache , subflag] = cer.exit(node,parameters,env,context)
                cache = {...cache , ...(subcache || {})} // 合并cache和cache
                flag = flag && subflag
            }
            return [cache , flag]
        } , 
        renderer: (props: PrinterRenderFunctionProps) => {
            let props_except_children = {
                node: props.node , 
                context: props.context , 
                parameters: props.parameters ,             
            }
            return <OUT {...props_except_children}>{props.children}</OUT>
        } , 
    })
}