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
    ProcessedParameterList , 

    get_default_group_renderer , 
} from "../lib"
export {renderer_theorem , renderer_strong , default_renderers}

let theo_order = new OrderContexter("order-theo")

// let renderer_theorem = new PrinterRenderer({
//     enter(node: Readonly<Node> , parameters: Readonly<ProcessedParameterList> , env: Env , context: Context){
//         theo_order.enter(node , parameters , env , context)
//     } , 
//     exit(node: Readonly<Node> , parameters: Readonly<ProcessedParameterList> , env: Env , context: Context):[any , boolean]{
//         theo_order.exit(node , parameters , env , context)
//         return [context , true]
//     } , 
//     renderer(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
//         let context = props.context
//         let parameters = props.parameters

//         let order = theo_order.get_context(context)
//         return <div>{parameters["name"]} {order}{props.children}</div>
//     }
// })

let renderer_theorem = (()=>{
    let orderer = new OrderContexter("theorem")

    let theoremprinter = get_default_group_renderer<GroupNode>({
        contexters: [
            orderer,
        ]
    })
    return theoremprinter
})()

let renderer_strong = new PrinterRenderer({
    renderer(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
        let node = props.node as InlineNode
        return <strong>{props.children}</strong>
    }
})


let default_renderer_block = new PrinterRenderer({
    renderer(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
        let node = props.node as GroupNode
        return <div>{props.children}</div>
    }
})

let default_renderer_inline = new PrinterRenderer({
    renderer(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
        return <span>{props.children}</span>
    }
})

let default_renderer_text = new PrinterRenderer({
    renderer(props: PrinterRenderFunctionProps):React.ReactElement<PrinterRenderFunctionProps>{
        let node = props.node as TextNode
        return <span>{node.text}</span>
    }
})

let default_renderers = {
    "group"     : default_renderer_block , 
    "struct"    : default_renderer_block , 
    "support"   : default_renderer_block , 
    "abstract"  : default_renderer_block , 
    "paragraph" : default_renderer_block , 
    "inline"    : default_renderer_inline , 
    "text"      : default_renderer_text , 
}
