import { Node } from "slate"
import type  { PrinterRenderFunc_Props } from "../../../printer"
import { GroupNode} from "../../../core/elements"
import Card from '@mui/material/Card'
import type { PrinterRenderer } from "../../../printer"
import { OrderEffector } from "../effecter"
import { GroupBox , InlineTitle } from "./basic_components"
import type { ValidParameters } from "../../../core/elements"
import type { PrinterEnv , PrinterContext } from "../../../printer"
export { get_DefaultGroupPrinter }


function get_DefaultGroupPrinter(
    key: string , 
    get_title : (parameters: ValidParameters) => string = (p:ValidParameters) => (p.title as string),
    get_prefix: (parameters: ValidParameters) => string = (p:ValidParameters) => ""
){
    let order_effector = new OrderEffector(
        `order/${key}` , 
        `order/${key}` , 
    )

    return {
        render_func: (props: PrinterRenderFunc_Props) => {
            let element = props.element as GroupNode 

            let order = order_effector.get_context(props.context)
            let title = get_title(element.parameters)

            return <GroupBox>
                <InlineTitle>{title} {order} {props.children[0]}</InlineTitle>
                {props.children}
            </GroupBox>
        } , 
        enter_effect: (element: PrinterContext, env: PrinterEnv): [PrinterEnv,PrinterContext] => {    
            let ret: [PrinterEnv , PrinterContext] = [ env , {} ]
    
            ret = order_effector.fuse_result( ret , order_effector.enter_effect(element , env) )
    
            return ret
        } , 
        exit_effect: (element: Node, env: PrinterEnv , context: PrinterContext):[PrinterEnv,PrinterContext] => {    
            let ret: [PrinterEnv , PrinterContext] = [ env , context ]
    
            ret = order_effector.fuse_result( ret , order_effector.enter_effect(element , env) )
    
            return ret
        } , 
    
    }
}

