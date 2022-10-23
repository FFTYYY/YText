import * as React from "react"
import { Grid } from "@mui/material"
import {
    PrinterRenderer , 
    Env , 
    Context , 
    Node , 
    PrinterRenderFunctionProps, 
    GroupNode,
    StructNode , 
    InlineNode,
    TextNode, 
    OrderContexter , 
    auto_renderer , 

    get_default_group_renderer , 
    get_default_inline_renderer , 
    get_default_paragraph_renderer, 
    get_default_abstract_renderer , 
    get_default_structure_renderer , 

    DefaultAbstractRendererAsProperty , 

    PreprocessInformation , 
    PrinterStructureBoxText , 
    PrinterPartBox , 

    useless_renderer_block , 
    useless_renderer_inline ,
    useless_renderer_text,
    ProcessedParameterList, 
} from "../../libprinter"

export {default_renderers , renderers}

let renderer_line = (()=>{
    function get_widths(node: StructNode, parameters: ProcessedParameterList){
        
        let widths_str = parameters.widths || ""
        let widths = widths_str.split(",").map(x=>(x == "" ? 1 : parseInt(x))) as number [] // convert to int list 
        if(widths.length > node.children.length){
            widths = widths.slice(0,node.children.length)
        }
        while(widths.length < node.children.length){
            widths.push(1)
        }
        return widths
    }
    let renderer = get_default_structure_renderer({
        inner(props){
            let {node , parameters , context , children} = props
            let widths = get_widths(node , parameters)
            let sum = widths.reduce((s , x)=>s + x , 0)
            return <Grid container columns={sum} sx={{width: "100%"}} spacing={2}>{props.children}</Grid>
        } , 
        subinner(props){
            let {node , parameters , context , children , subidx} = props
            let widths = get_widths(node , parameters)
            let my_width = widths[subidx]
            return <Grid item xs={my_width} sx={{align: "center"}}>{props.children}</Grid>
        }
    })
    return renderer
})()

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
                <React.Fragment> {parameters.alias}</React.Fragment>
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
    "structure"  : useless_renderer_block , 
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
    structure: {
        "line": renderer_line , 
    } , 
    abstract: {
        "comment": renderer_comment , 
    } , 
    support: {} , 
}