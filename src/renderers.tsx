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
    get_default_paragraph_renderer , 
    get_default_inline_renderer , 

    PrinterTitleBoxText , 
} from "../lib"
export {renderer_theorem , renderer_strong , default_renderers}

let theo_order = new OrderContexter("order-theo")

let renderer_theorem = (()=>{
    let orderer = new OrderContexter("theorem")

    let theoremprinter = get_default_group_renderer({
        contexters: [
            orderer,
        ] , 
        pre_element: (node,parameters,env,context) => {
            let order = orderer.get_context(context)
			let title = "Theorem"
			let alias = parameters.alias
            return <PrinterTitleBoxText inline>{title} {order} {alias}</PrinterTitleBoxText>
        }
    })
    return theoremprinter
})()


let renderer_strong = get_default_inline_renderer({outer:
    (props: PrinterRenderFunctionProps)=>{
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
    "paragraph" : get_default_paragraph_renderer({}) , 
    "inline"    : default_renderer_inline , 
    "text"      : default_renderer_text , 
}
