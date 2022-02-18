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
import { GroupNode} from "../../core/elements"
import type { PrinterRenderer } from "../../printer"
import { OrderEffector , InjectEffector , ConsumeEffector , BasicEffector} from "./effecter"
import type { ValidParameter } from "../../core/elements"
import type { PrinterEnv , PrinterContext } from "../../printer"
import { AutoStack } from "../basic"
import type {InjectFunction} from "./effecter"
import { PrinterBox , PrinterParagraph , PrinterInlineTitle , NewLevel } from "./basic/components"

export { get_DefaultParagraphPrinter }

function get_DefaultParagraphPrinter(){ 

    // 需要额外渲染的元素。
    let consumer_effector = new ConsumeEffector("global-injector" , "global-injector")

    return {
        render_func: (props: PrinterRenderFunc_Props) => {

            let extra =  consumer_effector.get_context(props.context) // 需要额外插入的元素。

            return <PrinterParagraph>
                {Object.keys(extra).map((key)=><React.Fragment key={key}>{extra[key]}</React.Fragment>)}
                {props.children}
            </PrinterParagraph>
        } , 
        enter_effect: (element: Node, env: PrinterEnv): [PrinterEnv,PrinterContext] => {  
            let ret: [PrinterEnv , PrinterContext] = [ env , {} ]
            
            ret = consumer_effector.enter_fuse(element , ret[0] , ret[1])
    
            return ret
        } , 
        exit_effect: (element: Node, env: PrinterEnv , context: PrinterContext):[PrinterEnv,PrinterContext] => {    
            let ret: [PrinterEnv , PrinterContext] = [ env , context ]
    
            ret = consumer_effector.exit_fuse(element , ret[0] , ret[1])
    
            return ret
        } , 
    }
}