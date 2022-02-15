/** 这个模块定义一个前作用辅助器，用来帮助注入元素。
 * 
 */
import { Node } from "slate"
import { BasicEffector } from "./base"
import type { OptionFunc } from "./base"
import type { EnterEffectFunc , ExitEffectFunc } from "../../../printer"
import type { PrinterEnv , PrinterContext } from "../../../printer"


export { InjectEffector , ConsumeEffector }

class InjectEffector<NODETYPE = Node> extends BasicEffector<NODETYPE>{
    to_inject: any

    constructor(
        env_key: string , 
        context_key: string , 
        to_inject?: (element: NODETYPE, env: PrinterEnv, context: PrinterContext) => any , 
    ){
        // env 是一个注入序列。
        super(env_key , context_key , [])
        this.to_inject = to_inject || ( (e,v,c)=><></>)
    }
    enter_effect(element: NODETYPE, env: PrinterEnv, context:PrinterContext) : [PrinterEnv,PrinterContext] {
        
        // 将 to_inject 加入 env。
        env = this.set_env(env , [
            ...this.get_env(env) , this.to_inject(element,env,context)
        ])
        
        return [env , {}]
    }
}

class ConsumeEffector<NODETYPE = Node> extends BasicEffector<NODETYPE>{
    constructor(
        env_key: string , 
        context_key: string , 
    ){
        super(env_key , context_key , [])
    }
    enter_effect(element: NODETYPE, env: PrinterEnv, context:PrinterContext) : [PrinterEnv,PrinterContext] {  
        console.log(env)
        return [env , this.make_context(this.get_env(env))]
    }
}