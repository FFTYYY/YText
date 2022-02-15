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
    get_enter_effect():EnterEffectFunc {
        let me = this
        return (element: Node, env: any) => {
            env = me.ensure_env(env)
            let order = me.get_env(env)

            // 把当前层级清零。
            if(me.clear_order(element, env)){
                order = 0
            }

            order ++
            me.set_env(env , order)

            return [env , me.make_context({
                order: order ,
            })]
        }
    }
    get_exit_effect(): ExitEffectFunc{
        let me = this
        return (element: Node, env: any, context:any ) => { 
            let my_context = me.get_context(context)

            env = me.set_env( env , my_context.order ) // 还原环境

            return [env , me.make_context(
                my_context.order
            )]
        }
    }

}