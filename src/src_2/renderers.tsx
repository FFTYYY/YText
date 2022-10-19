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
    auto_renderer , 

    get_default_group_renderer , 
    get_default_inline_renderer , 
    get_default_paragraph_renderer, 
    get_default_abstract_renderer , 

    DefaultAbstractRendererAsProperty , 

    PreprocessInformation , 
    PrinterStructureBoxText , 
    PrinterPartBox , 

    useless_renderer_block , 
    useless_renderer_inline ,
    useless_renderer_text, 
} from "../../lib"

export {default_renderers , renderers}

var renderer_theorem = (()=>{

	let orderer_gene = (info:PreprocessInformation<GroupNode>)=>new OrderContexter<GroupNode>(info.parameters.label)

	let printer = get_default_group_renderer({
		contexters: [
			orderer_gene, 
		] , 
		pre_element: (info: PreprocessInformation<GroupNode>) => {
            let {node , context , parameters , env} = info

            let orderer = orderer_gene(info) // 现场生成orderer。
            let order = orderer.get_context(context) // 获得自身的编号。

			return <PrinterStructureBoxText inline>
                <DefaultAbstractRendererAsProperty
                    {...{node , context, parameters}}
                    senario = "title"
                >
                    <React.Fragment>{parameters.name} {order}</React.Fragment>
                </DefaultAbstractRendererAsProperty>
            </PrinterStructureBoxText>
		} , 
		outer: (props) => {
			return <PrinterPartBox subtitle_like>{props.children}</PrinterPartBox>
		} , 
	})
	return printer
})()

var renderer_strong = (()=>{
	return get_default_inline_renderer({
		outer: (props: PrinterRenderFunctionProps<InlineNode>) => {
			return <strong>{props.children}</strong>
		}
	})
})()

let renderer_comment = get_default_abstract_renderer({
    senario: "title"
})

let default_renderers = {
    "group"     : useless_renderer_block , 
    "struct"    : useless_renderer_block , 
    "support"   : useless_renderer_block , 
    "abstract"  : useless_renderer_block , 
    "paragraph" : get_default_paragraph_renderer({}) , 
    "inline"    : useless_renderer_inline , 
    "text"      : useless_renderer_text , 
}

let renderers = {
    group: {
        "theorem": renderer_theorem , 
    } , 
    inline: {
        "strong": renderer_strong , 
    } , 
    struct: {} , 
    abstract: {
        "comment": renderer_comment , 
    } , 
    support: {} , 
}