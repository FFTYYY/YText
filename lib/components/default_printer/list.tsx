import { Node } from "slate"
import type  { PrinterRenderFunc_Props } from "../../printer"
import { GroupNode} from "../../core/elements"
import Card from '@mui/material/Card'
import { PrinterRenderer } from "../../printer"
import { OrderEffector } from "./effecter"

export { DefaultListPrinter }


class DefaultListPrinter extends PrinterRenderer{
    order_effector: OrderEffector

    constructor(){
        super()
        this.render_func  = this.my_render_func.bind(this)
        this.enter_effect = this.my_enter_effect.bind(this)
        this.exit_effect  = this.my_exit_effect.bind(this)

        this.order_effector = new OrderEffector(
            "order" , 
            "order" , 
            (element, env) => element.relation == "separating" , 
        )
    }

    my_render_func(props: PrinterRenderFunc_Props){
        let order = props.context.order

        return <Card sx={{marginLeft: "1%"}}>{order}:{props.children}</Card>
    }
    my_enter_effect(_element: Node, env: any): [any,any]{
        let element = _element as GroupNode

        let [new_env , new_context] = this.order_effector.get_enter_effect()(element , env)
        
        return [new_env , new_context]
    } 
    my_exit_effect(_element: Node, env: any , context: any):[any,any]{
        let element = _element as GroupNode

        let [new_env , new_context] = this.order_effector.get_exit_effect()(element , env, context )

        return [new_env , new_context]
    } 
}

