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
import { OrderEffector , InjectEffector , ConsumeEffector} from "./effecter"
import { PrinterGroupBox , PrinterParagraphBox , PrinterInlineTitle } from "./basic/components"
import type { ValidParameters } from "../../core/elements"
import type { PrinterEnv , PrinterContext } from "../../printer"
import { AutoStack } from "../basic"

export { get_DefaultGroupPrinter }


function get_DefaultGroupPrinter(
    key: string , 
    get_title : (parameters: ValidParameters) => string = (p:ValidParameters) => (p.title as string),
    get_prefix: (parameters: ValidParameters) => string = (p:ValidParameters) => ""
){
    let order_effector = new OrderEffector<GroupNode>(
        `order/${key}` , 
        `order/${key}` , 
    )
    let inject_effector = new InjectEffector<GroupNode>("injector" , "injector" , 
        (element: GroupNode, env: PrinterEnv , context: PrinterContext) => {
            let order = order_effector.get_context(context)
            let title = get_title(element.parameters)            
            return <span>{title} {order}: </span>
        }
    )

    return {
        render_func: (props: PrinterRenderFunc_Props) => {
            let element = props.element as GroupNode 

            return <PrinterGroupBox>{props.children}</PrinterGroupBox>
        } , 
        enter_effect: (element: GroupNode, env: PrinterEnv): [PrinterEnv,PrinterContext] => {    
            let ret: [PrinterEnv , PrinterContext] = [ env , {} ]
    
            ret = order_effector.enter_fuse(element , ret[0] , ret[1])
            ret = inject_effector.enter_fuse(element , ret[0] , ret[1])

            console.log("group-enter" , ret[0])
    
            return ret
        } , 
        exit_effect: (element: GroupNode, env: PrinterEnv , context: PrinterContext):[PrinterEnv,PrinterContext] => {    
            let ret: [PrinterEnv , PrinterContext] = [ env , context ]
    
            ret = order_effector.exit_fuse(element , ret[0] , ret[1])
            ret = inject_effector.exit_fuse(element , ret[0] , ret[1])
    
            return ret
        } , 
    }
}

