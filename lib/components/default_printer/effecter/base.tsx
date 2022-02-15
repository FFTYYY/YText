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
    enter_effect(element: Node, env: any) {
        return [env , {}]
    }
    exit_effect(element: Node, env: any, context:any){
        return [env , context]
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

    fuse_result(ret: [any , any], new_ret: [any , any]): [any,any]{
        let [old_env , old_context] = ret
        let [new_env , new_context] = new_ret
        return [new_env , {...old_context , new_context}]
    }
}