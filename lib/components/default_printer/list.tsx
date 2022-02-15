import { Node } from "slate"
import type  { PrinterRenderFunc_Props } from "../../printer"
import { GroupNode} from "../../core/elements"
import Card from '@mui/material/Card'
import type { PrinterRenderer } from "../../printer"
import { OrderEffector } from "./effecter"

export { DefaultListPrinter }


class DefaultListPrinter{
    order_effector: OrderEffector

    constructor(){

        this.order_effector = new OrderEffector(
            "order" , 
            "order" , 
            (element, env) => element.relation == "separating" , 
        )
    }

    render_func(props: PrinterRenderFunc_Props){
        let order = props.context.order

        return <Card sx={{marginLeft: "1%"}}>{order}:{props.children}</Card>
    }
    enter_effect(_element: Node, env: any): [any,any]{
        let element = _element as GroupNode

        let ret: [any , any] = [ env , {} ]

        ret = this.order_effector.fuse_result( ret , 
            this.order_effector.enter_effect(element , env)
        )

        return ret
    } 
    exit_effect(_element: Node, env: any , context: any):[any,any]{
        let element = _element as GroupNode

        let ret: [any , any] = [ env , context ]

        ret = this.order_effector.fuse_result( ret , 
            this.order_effector.exit_effect(element , env, context )
        )

        return ret
    } 
}

