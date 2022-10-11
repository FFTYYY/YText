/** 这个模块定义一个上下文工具，用来帮助渲染器自动确定编号。 
 * @module
*/

import { 
    Env , 
    Context , 
    PrinterEnterFunction , 
    PrinterExitFunction , 
    ProcessedParameterList , 
} from "../../core/renderer"
import { 
	Node , 

} from "../../core/intermidiate"
import {
    ContexterBase
} from "./base"

export { OrderContexter }

class OrderContexter<NT = Node> extends ContexterBase<NT>{

    /** 标明排序的对象。 */
    order_key: string

    constructor(order_key: string){
        super("__order" , {})
        this.order_key = order_key
    }

    enter(node: Readonly<NT> , parameters: Readonly<ProcessedParameterList> , env: Env , context: Context){
        let e = this.get_env(env)
        e[this.order_key] = e[this.order_key] || 0 // 初始化这一项的排序
        e[this.order_key] ++
        this.set_context(context , e[this.order_key])
    }
    exit(node: Readonly<NT> , parameters: Readonly<ProcessedParameterList> , env: Env , context: Context): [any , boolean]{
        return [undefined , true]
    }
}
