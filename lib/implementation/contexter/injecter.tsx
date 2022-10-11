/** 这个模块定义一对上下文工具，用来在节点之间传递信息。
 * 具体来说，这个模块定义了一个『注射器』（Injector）和『接收器』（Consumer）。
 * 注射器可以向环境中发射一个信息，这个信息用一个key来编号，之后的节点可以通过接收器来接收这个信息，通过key来配对。
 * 注射器是不特定的，任何一个带有注射器且处理相同key的节点都可以处理此信息。
 */
import { ContexterBase } from "./base"
import { 
    Env , 
    Context , 
    Node , 
    ProcessedParameterList , 
} from "../../core"


export { InjectContexter , ConsumerContexter }
export type { InjectInformation }

/** 这个函数说明如何生成需要注入的信息。
 * 初始化时，这个函数被提供给注射器，预处理遍历到对应节点时，根据这个节点的信息生成所需的信息。
 */
type InjectInformation<NT extends Node> = (
    node: Readonly<NT>, 
    parameters: Readonly<ProcessedParameterList>, 
    env: Env , 
    context: Context
) => any

/** 这个上下文工具允许节点向之后的节点的渲染函数注入一定的可渲染元素。 */
class InjectContexter<NT extends Node = Node> extends ContexterBase<NT>{
    /**
     * 『注射器』上下文工具的构造函数。
     * @param infokey 要注射的信息配对使用的key。
     * @param infos.preinfo 在进入节点时（先序）生成的信息。 
     * @param infos.aftinfo 在离开节点时（后序）生成的信息。
     * 
     */
    infokey: string
    preinfo: InjectInformation<NT>
    aftinfo: InjectInformation<NT>
    constructor(infokey: string, infos: {preinfo?: InjectInformation<NT>, aftinfo?: InjectInformation<NT>}){
        super("__injector_consumer" , {})
        this.infokey = infokey
        this.preinfo = infos.preinfo || ( (n,p,e,c)=>undefined )
        this.aftinfo = infos.aftinfo || ( (n,p,e,c)=>undefined )
    }
    enter(node: Readonly<NT>, parameters: Readonly<ProcessedParameterList>, env: Env, context: Context): void {
        this.ensure_env(env)
        let e = this.get_env(env)
        e[this.infokey] = this.preinfo(node,parameters,env,context)
    }
    exit(node: Readonly<NT>, parameters: Readonly<ProcessedParameterList>, env: Env, context: Context): [any, boolean] {
        this.ensure_env(env)
        let e = this.get_env(env)
        e[this.infokey] = this.aftinfo(node,parameters,env,context)
        return [undefined , true]
    }
}

/** 这个上下文工具接收注射器提供的信息，并提供给节点。*/
class ConsumerContexter<NT extends Node = Node> extends ContexterBase<NT>{
    infokey: string

    /** 接收器（Injector）上下文工具的构造函数。
     * @param infokey 要接收的信息配对使用的key。
     */
    constructor(
        infokey: string , 
    ){
        super("__injector_consumer" , {})
        this.infokey = infokey
    }
    enter(node: Readonly<NT>, parameters: Readonly<ProcessedParameterList>, env: Env, context: Context): void {
        this.ensure_env(env)
        let e = this.get_env(env)
        this.set_context(context , e[this.infokey])
    }
}