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
    OrderContexter , 
} from "../lib"
export {renderer_theorem , renderer_strong , default_renderers}

let theo_order = new OrderContexter("order-theo")
let renderer_theorem = new PrinterRenderer(
    function enter(node: Readonly<Node> , env: Env , context: Context){
        theo_order.enter(node , env , context)
    } , 
    function exit(node: Readonly<Node> , env: Env , context: Context):[any , boolean]{
        theo_order.exit(node , env , context)
        return [context , true]
    } , 
    function render(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
        let node = props.node
        let context = props.context
        let parameters = props.parameters
        node = node as GroupNode

        let order = theo_order.get_context(context)
        return <div>{parameters["name"]} {order}{props.children}</div>
    }
)

let renderer_strong = new PrinterRenderer(
    function enter(node: Node , env: Env , context: Context){
        
    } , 
    function exit(node: Node , env: Env , context: Context):[any , boolean]{
        return [context , true]
    } , 
    function render(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
        let node = props.node as InlineNode
        return <strong>{props.children}</strong>
    }
)


let default_renderer_block = new PrinterRenderer(
    function enter(node: Node , env: Env , context: Context){
    } , 
    function exit(node: Node , env: Env , context: Context):[ any , boolean]{
        return [context , true]
    } , 
    function render(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
        let node = props.node as GroupNode
        return <div>{props.children}</div>
    }
)

let default_renderer_inline = new PrinterRenderer(
    function enter(node: Node , env: Env , context: Context){
    } , 
    function exit(node: Node , env: Env , context: Context):[any , boolean]{
        return [context , true]
    } , 
    function render(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
        let node = props.node as InlineNode
        console.log(node)
        return <span>{props.children}</span>
    }
)

let default_renderer_text = new PrinterRenderer(
    function enter(node: Node , env: Env , context: Context){
    } , 
    function exit(node: Node , env: Env , context: Context):[any , boolean]{
        return [context , true]
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
