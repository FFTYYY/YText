import React from "react"

import {
    Typography , 
    Box , 
    Paper , 
} from "@mui/material"
import type {
    TypographyProps , 
    PaperProps , 
    BoxProps , 
} from "@mui/material"


import { Node } from "slate"
import type  { PrinterRenderFunc_Props } from "../../printer"
import { GroupNode , StyledNode} from "../../core/elements"
import type { PrinterRenderer } from "../../printer"
import { OrderEffector , InjectEffector , ConsumeEffector , BasicEffector} from "./effecter"
import type { ValidParameter } from "../../core/elements"
import type { PrinterEnv , PrinterContext } from "../../printer"
import { AutoStack } from "../basic"
import type {InjectFunction} from "./effecter"
import { PrinterBox , PrinterParagraph , PrinterInlineTitle , NewLevel } from "./basic/components"

export { get_DefaultBlockPrinter }

/**
 * 这个函数生产一个默认的块级组件的输出渲染器。
 * @param extra_effectors 额外的前作用器。 
 * @param inject_pre 要在渲染前注入的东西（行内元素）。 
 * @param inject_suf 要在渲染后注入的东西（行内元素）。 
 * @param outer      大的框框。 
 * @param inner 内部的框框。 
 * @returns 一个输出渲染器。
 */
function get_DefaultBlockPrinter<NodeType extends StyledNode>({ 
	extra_effectors = [] , 
	inject_pre = (props)=><></>, 
	inject_suf = (props)=><></>, 
    outer = (props)=><PrinterBox>{props.children}</PrinterBox> , 
    inner = (props)=><>{props.children}</>, 
}:{
	extra_effectors?: BasicEffector[] ,
	inject_pre?: (props: {element: NodeType, context: PrinterContext}) => any
	inject_suf?: (props: {element: NodeType, context: PrinterContext}) => any
	outer     ?: (props: {element: NodeType, context: PrinterContext, children: any}) => any
    inner?: (props: {element: NodeType, context: PrinterContext, children: any}) => any
}){
    let OUT = outer
    let INN = inner
    let inject_effector = new InjectEffector<NodeType>("global-injector" , "global-injector" , inject_pre , inject_suf)

    return {
        render_func: (props: PrinterRenderFunc_Props) => {
            let element = props.element as NodeType 

            return <OUT element={element} context={props.context}>
                <INN element={element} context={props.context}>{props.children}</INN>
            </OUT>
        } , 
        enter_effect: (element: NodeType, env: PrinterEnv): [PrinterEnv,PrinterContext] => {    
            let ret: [PrinterEnv , PrinterContext] = [ env , {} ]
            
            // 应用额外的前作用器。
            for(let extra_eff of extra_effectors){
                ret = extra_eff.enter_fuse(element , ret[0] , ret[1])
            }
            // 注入前作用。
            ret = inject_effector.enter_fuse(element , ret[0] , ret[1])
    
            return ret
        } , 
        exit_effect: (element: NodeType, env: PrinterEnv , context: PrinterContext):[PrinterEnv,PrinterContext] => {    
            let ret: [PrinterEnv , PrinterContext] = [ env , context ]
    
            for(let extra_eff of extra_effectors){
                ret = extra_eff.exit_fuse(element , ret[0] , ret[1])
            }
            ret = inject_effector.exit_fuse(element , ret[0] , ret[1])
    
            return ret
        } , 
    }
}

