/**
 * 这个模块定义印刷实现。
 * 每个一级概念都必须提供自己的印刷实现，另外段落也需要提供印刷实现。
 */

import {
    Node , 
    ParameterList , 
} from "./intermidiate"

export {
    PrinterRenderer , 
}
export type {
    Env , 
    Context , 
    PrinterEnterFunction , 
    PrinterExitFunction , 
    PrinterRenderFunctionProps , 
    PrinterRenderFunction , 
    ProcessedParameterList , 
}

/** 渲染器所需要维护的环境。 */
type Env = {[key: string | number]: any}

/** 渲染器所需要维护的节点的上下文。 */
type Context = {[key: string | number]: any}

/** 经过处理的参数列表。 */
type ProcessedParameterList = {[key: string]: any}

/** 进入时操作。注意，这个操作应是原地操作。 */
type PrinterEnterFunction = (
    node: Readonly<Node>, 
    parameters: Readonly<ProcessedParameterList>, 
    env_draft: Env, 
    context_draft: Context
) => void

/** 离开时操作。 注意，这操作应是原地操作。*/
type PrinterExitFunction = (
    node: Readonly<Node>, 
    parameters: Readonly<ProcessedParameterList>, 
    env_draft: Env, 
    context_draft: Context
) => [cache_result: any, finished: boolean]

/** 渲染器的渲染函数的props。 */
interface PrinterRenderFunctionProps {

    /** 要渲染的节点。大多数情况下渲染器不应该访问节点，而应该从`context`和`parameters`获取需要的信息。 */
	readonly node: Node
    /** 经过预处理获得的`context`。 */
	readonly context: Context

    /** 经过处理的参数列表，这个参数还原成了一级概念的参数列表。 
     * 注意，这个列表的类型不是`PrinterParameterList`，因为其中已经去掉的类型的信息，而只是一个值的字典。
    */
    readonly parameters: {[key: string]: any}

    /** 子节点列表，这个是用来递归渲染用的。 */
	readonly children: React.ReactElement
}

/** 渲染器的渲染函数。 */
type PrinterRenderFunction = (props: PrinterRenderFunctionProps) => React.ReactElement<PrinterRenderFunctionProps>

/** 总之是渲染器。 */
class PrinterRenderer{

    /** 进入时操作。 */
	enter: PrinterEnterFunction

    /** 退出时操作。 */
	exit: PrinterExitFunction

    /** 渲染函数。 */
	renderer: PrinterRenderFunction

    /**
     * 渲染器的构造函数。
     * @param funcs.enter 进入时操作。
     * @param funcs.exit 退出时操作。
     * @param funcs.renderer 渲染函数。
     */
    constructor(funcs:{enter?: PrinterEnterFunction, exit?: PrinterExitFunction, renderer?: PrinterRenderFunction}){
        this.enter = funcs.enter || ((n,p,e,c)=>{})
        this.exit = funcs.exit || ((n,p,e,c)=>[undefined, true])
        this.renderer = funcs.renderer
    }
}

