/** 这个模块定义一个前作用辅助器，用来帮助生成编号。
 * 
 */
import { Node } from "slate"
import { BasicEffector } from "./base"
import type { EnterEffectFunc , ExitEffectFunc } from "../../../printer"
export { OrderEffector }

type OptionFunc<T> = (element: any, env: any, context?: any) => T
let default_option = (element: any, env: any, context?: any) => false

class OrderEffector extends BasicEffector{
    clear_order: OptionFunc<boolean>

    constructor(
        env_key: string , 
        context_key: string , 
        clear_order: OptionFunc<boolean> = default_option, 
    ){
        super(env_key , context_key , 0)
        this.clear_order = clear_order
    }
    enter_effect(element: Node, env: any):[any,any] {
        env = this.ensure_env(env)
        let order = this.get_env(env)

        // 把当前层级清零。
        if(this.clear_order(element, env)){
            order = 0
        }

        order ++
        this.set_env(env , order)

        return [env , this.make_context({
            order: order ,
        })]
    }
    exit_effect(element: Node, env: any, context:any): [any,any]{
        let my_context = this.get_context(context)

        env = this.set_env( env , my_context.order ) // 还原环境

        return [env , this.make_context(
            my_context.order
        )]
    }

}