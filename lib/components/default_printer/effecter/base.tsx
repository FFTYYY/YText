/** 这个模块定义所有前作用辅助器的基类。
 * @module
 */
import { Node } from "slate"
import { Printer } from "../../../printer"
import type { EnterEffectFunc , ExitEffectFunc } from "../../../printer"

export { BasicEffector }

class BasicEffector{
    env_key: string
    context_key: string
    _default_val: string
    constructor(env_key:string, context_key: string, default_val: any){
        this.env_key = env_key
        this.context_key = context_key
        this._default_val = default_val
    }
    get_enter_effect():EnterEffectFunc {
        return (element: Node, env: any) => [env , {}]
    }
    get_exit_effect(): ExitEffectFunc{
        return (element: Node, env: any, context:any ) => [env , context]
    }

    ensure_env(env: any){
        if(env[this.env_key] == undefined){
            env[this.env_key] = this._default_val
        }
        return env
    }

    get_env(env: any){
        env = this.ensure_env(env)
        return env[this.env_key]
    }

    set_env(env: any , val: any){
        env[this.env_key] = val
        return env
    }

    get_context(context: any){
        return context[this.context_key]
    }

    set_context(context: any , val: any){
        context[this.context_key] = val
        return context
    }

    make_context(val: any){
        return {[this.context_key]: val}
    }
}