/** 这个模块定义一个上下文工具，用来帮助渲染器自动确定编号。 
 * @module
*/

import { 
    Env , 
    Context , 
    PrinterEnterFunction , 
    PrinterExitFunction , 
} from "../../core/renderer"
import { 
	Node , 

} from "../../core/intermidiate"
import {
    ContexterBase
} from "./base"

export { OrderContexter }

class OrderContexter<T = Node> extends ContexterBase<T>{
    constructor(key:string){
        super(key , ()=>({"order": 0}))
    }

    enter(node: T , env: Env , context: Context){
        let e = this.get_env(env)
        e["order"] ++
        this.set_context(context , e["order"])
    }
    exit(node: T , env: Env , context: Context): [any , boolean]{
        return [undefined , true]
    }
    
}
