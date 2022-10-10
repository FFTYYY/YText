import * as React from "react"
import {
    PrinterRenderer , 
    Env , 
    Context , 
    Node , 
    PrinterRenderFunctionProps, 
    GroupNode,
    InlineNode,
    TextNode, 
} from "../lib"
export {renderer_theorem , renderer_strong , default_renderers}

let renderer_theorem = new PrinterRenderer(
    function enter(node: Node , env: Env , context: Context):[env: Env , context: Context]{
        if(env["num_theorem"] == undefined){
            env["num_theorem"] = 0
        }
        env["num_theorem"] += 1
        return [env , {...context , "order": env["num_theorem"]}]
    } , 
    function exit(node: Node , env: Env , context: Context):[Env , Context , any , boolean]{
        return [env , context , context , true]
    } , 
    function render(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
        let node = props.node
        let context = props.context
        let parameters = props.parameters
        node = node as GroupNode
        console.log("?!")
        return <div>{parameters["name"]}{context["order"]}{props.children}</div>
    }
)

let renderer_strong = new PrinterRenderer(
    function enter(node: Node , env: Env , context: Context):[env: Env , context: Context]{
        return [env , context]
    } , 
    function exit(node: Node , env: Env , context: Context):[Env , Context , any , boolean]{
        return [env , context , context , true]
    } , 
    function render(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
        let node = props.node as InlineNode
        console.log("??")
        return <strong>{props.children}</strong>
    }
)


let default_renderer_block = new PrinterRenderer(
    function enter(node: Node , env: Env , context: Context):[env: Env , context: Context]{
        return [env , context]
    } , 
    function exit(node: Node , env: Env , context: Context):[Env , Context , any , boolean]{
        return [env , context , context , true]
    } , 
    function render(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
        let node = props.node as GroupNode
        return <div>{props.children}</div>
    }
)

let default_renderer_inline = new PrinterRenderer(
    function enter(node: Node , env: Env , context: Context):[env: Env , context: Context]{
        return [env , context]
    } , 
    function exit(node: Node , env: Env , context: Context):[Env , Context , any , boolean]{
        return [env , context , context , true]
    } , 
    function render(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
        let node = props.node as InlineNode
        console.log(node)
        return <span>{props.children}</span>
    }
)

let default_renderer_text = new PrinterRenderer(
    function enter(node: Node , env: Env , context: Context):[env: Env , context: Context]{
        return [env , context]
    } , 
    function exit(node: Node , env: Env , context: Context):[Env , Context , any , boolean]{
        return [env , context , context , true]
    } , 
    function render(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
        let node = props.node as TextNode
        return <span>{node.text}</span>
    }
)

let default_renderers = {
    "group"     : default_renderer_block , 
    "struct"    : default_renderer_block , 
    "support"   : default_renderer_block , 
    "abstract"  : default_renderer_block , 
    "paragraph" : default_renderer_block , 
    "inline"    : default_renderer_inline , 
    "text"      : default_renderer_text , 
}
