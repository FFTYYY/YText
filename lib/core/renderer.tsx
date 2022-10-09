/**
 * 这个模块定义印刷实现。
 * 每个一级概念都必须提供自己的印刷实现，另外段落也需要提供印刷实现。
 */

import {
    Node , 
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
}

/** 渲染器所需要维护的环境。 */
type Env = {[key: string | number]: any}
/** 渲染器所需要维护的节点的上下文。 */
type Context = {[key: string | number]: any}

/** 进入时操作。 */
type PrinterEnterFunction = (node: Node , env: Env , context: Context) => [env: Env , context: Context]

/** 离开时操作。 */
type PrinterExitFunction = (node: Node , env: Env , context: Context) => [env: Env , context: Context , cacheResult: any, finished: boolean]

/** 渲染器的渲染函数的props。 */
interface PrinterRenderFunctionProps {
	context: Context
	node: Node
	children: React.ReactElement
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

    constructor(enter: PrinterEnterFunction, exit: PrinterExitFunction, renderer: PrinterRenderFunction){
        this.enter = enter 
        this.exit = exit
        this.renderer = renderer
    }
}

