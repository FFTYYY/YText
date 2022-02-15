import { Node } from "slate"
import type  { PrinterRenderFunc_Props } from "../../../printer"
import { GroupNode} from "../../../core/elements"
import Card from '@mui/material/Card'
import type { PrinterRenderer } from "../../../printer"
import { OrderEffector } from "../effecter"
import { GroupBox , InlineTitle } from "./basic_components"

export { get_DefaultGroupPrinter }


function get_DefaultGroupPrinter(
    key: string , 
    get_title: (parameters: any) => string = (p:any) => p.title,
    get_prefix: (parameters: any) => string = (p:any) => ""
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
                <InlineTitle>{title} {order}</InlineTitle>
                {props.children}
            </GroupBox>
        } , 
        enter_effect: (element: Node, env: any): [any,any] => {    
            let ret: [any , any] = [ env , {} ]
    
            ret = order_effector.fuse_result( ret , order_effector.enter_effect(element , env) )
    
            return ret
        } , 
        exit_effect: (element: Node, env: any , context: any):[any,any] => {    
            let ret: [any , any] = [ env , context ]
    
            ret = order_effector.fuse_result( ret , order_effector.enter_effect(element , env) )
    
            return ret
        } , 
    
    }
}

