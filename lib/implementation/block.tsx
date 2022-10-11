import React from "react"

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
    PrinterRenderFunctionProps , 
    PrinterRenderFunction , 
    PrinterRenderer , 
    Env , 
    Context , 
} from "../core"
import {
    ContexterBase
} from "./contexter"
import { 
    PrinterPartBox , 
} from "./basic/components"

export { get_default_group_renderer }

// TODO get_default_group_renderer 还没添加element_pre/aft和text_pre/aft

/** 这个函数快速生产一个默认的块级组件的渲染器。 
 * 同时，这个函数会使用上下文工具，快捷地允许向段落的开头和结尾添加元素。
*/
function get_default_group_renderer<NT extends ConceptNode>({
    contexters = [] , 
    outer = (props: PrinterRenderFunctionProps)=><PrinterPartBox>{props.children}</PrinterPartBox> , 
    inner = (props: PrinterRenderFunctionProps)=><>{props.children}</> , 
}:{
    contexters?: ContexterBase<NT>[]
    element_pre?: PrinterRenderFunction
    element_aft?: PrinterRenderFunction
    text_pre?: PrinterRenderFunction
    text_aft?: PrinterRenderFunction
    outer?: PrinterRenderFunction
    inner?: PrinterRenderFunction
}){
    let OUT = outer
    let INN = inner

    return new PrinterRenderer({
        enter: (node: Readonly<NT>, parameters: Readonly<ProcessedParameterList>, env: Env, context: Context) => {
            for(let cer of contexters){
                cer.enter(node,parameters,env,context)
            }
        } , 
        exit: (node: Readonly<NT>, parameters: Readonly<ProcessedParameterList>, env: Env, context: Context) => {
            let cache = undefined // TODO 这个没有真正地被处理
            let flag = true
            for(let cer of contexters){
                let [subcache , subflag] = cer.exit(node,parameters,env,context)
                if(subcache != undefined){
                    if(cache == undefined){
                        cache = subcache
                    }
                    else{
                        cache = {...cache , ...subcache}
                    }
                }
                
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
            return <OUT {...props_except_children}>
                <INN {...props_except_children}>{props.children}</INN>
            </OUT>
        } , 
    })
}

/** 这个函数生成一个默认的段落样式。 
 * 这个函数生成的段落会使用上下文工具来允许:
 * + 在段落开头添加一个元素；
 * + 在段落开头添加一个文本；
 * 注意，永远不在段落结尾添加元素，因为概念上段落的数量是不确定的。
 * 
 * @param element_key 在段落开头添加元素的键。
 * @param text_key 在段落开头添加文本的键。
 * @param contexters 其他上下文作用器。
*/
function get_default_paragrapg_renderer({
    element_key = "paragraph-element" , 
    text_key = "paragraph-text" , 
    contexters = []
}:{
    element_key?: string
    text_key?: string
    contexters?: ContexterBase []
}){ 
    // TODO
}
