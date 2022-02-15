/** 这个模块定义一个前作用辅助器，用来帮助生成编号。
 * 
 */
import { Node } from "slate"
import { BasicEffector } from "./base"
import type { EnterEffectFunc , ExitEffectFunc } from "../../../printer"
import type { PrinterEnv , PrinterContext } from "../../../printer"


export { OrderEffector }

type OptionFunc<T> = (element: Node, env: PrinterEnv, context?: PrinterContext) => T
let default_option = (element: Node, env: PrinterEnv, context?: PrinterContext) => false

class OrderEffector extends BasicEffector{
    clear_order: OptionFunc<boolean>

    constructor(
        env_key: string , 
        context_key: string , 
        clear_order: OptionFunc<boolean> = (e,v,c)=>false, 
    ){
        super(env_key , context_key , 0)
        this.clear_order = clear_order
    }
    enter_effect(element: Node, env: PrinterEnv):[PrinterEnv,PrinterContext] {
        env = this.ensure_env(env)
        let order = this.get_env(env)

        // 把当前层级清零。
        if(this.clear_order(element, env)){
            order = 0
        }

        order ++
        env = this.set_env(env , order)

        return [env , this.make_context(order)]
    }
    exit_effect(element: Node, env: PrinterEnv, context:PrinterContext): [PrinterEnv,PrinterContext]{
        let order = this.get_context(context)

        env = this.set_env( env , order ) // 还原环境

        return [env , this.make_context( order )]
    }

}