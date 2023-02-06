import * as React from 'react'
import reactLogo from './assets/react.svg'


import {
	FirstClassConcept , 
	SecondClassConcept ,  
} from "@ftyyy/ytext"

let math = new FirstClassConcept({
	type:"group" , 
	name: "math" , 
	parameter_prototype: {
		name: {
			val: "Proposition", 
			type: "string" , 
		} , 
	}
})

let theorem = new SecondClassConcept({
	type: "group" , 
	first_concept: "math" , 
	name: "theorem" , 
	default_override: {
		alias: {
			val: "" , 
			type: "string" , 
		} , 
	} , 
	fixed_override: {
		name: {
			val: "p=> p.alias.val ? `Theorem (${p.alias.val})` : 'Theorem'" , 
			type: "function" , 
		}
	}
})

import {
	PreprocessInformation , 
	GroupNode , 
	OrderContexter , 
	get_default_group_renderer , 
	DefaultAbstractRendererAsProperty , 
	PrinterStructureBoxText , 
	PrinterPartBox , 
} from "@ftyyy/ytext"
var math_printer = (()=>{

	let number_gene = (info:PreprocessInformation<GroupNode>)=>new OrderContexter<GroupNode>("math")
	let printer = get_default_group_renderer({
		contexters: [
			number_gene, 
		] , 
		pre_element: (info: PreprocessInformation<GroupNode>) => {
            let {node , context , parameters , env} = info

            let number = number_gene(info).get_context(context) // generate order
			let name = parameters.name
			
			return <DefaultAbstractRendererAsProperty {...{node, context, parameters}} senario="title">
				<PrinterStructureBoxText inline>{`${name} (${number})`}</PrinterStructureBoxText>
			</DefaultAbstractRendererAsProperty>
		} , 
		outer: (props) => {
			return <PrinterPartBox subtitle_like>{props.children}</PrinterPartBox>
		} , 
	})
	return printer
})()
import {
	get_default_paragraph_renderer , 
	useless_renderer_block , 
	useless_renderer_inline , 
	useless_renderer_text , 
} from "@ftyyy/ytext"
let default_renderers = {
	"group"     : useless_renderer_block , 
    "structure" : useless_renderer_block , 
    "support"   : useless_renderer_block , 
    "abstract"  : useless_renderer_block , 
    "paragraph" : get_default_paragraph_renderer({}) , 
    "inline"    : useless_renderer_inline , 
    "text"      : useless_renderer_text , 
}


import {
	get_deafult_group_editor_with_appbar , 
	get_default_editors , 
} from "@ftyyy/ytext"

let math_editor  = get_deafult_group_editor_with_appbar({
    get_label: (n,p) => p.name
})


import {
	Printer , 
	EditorCore , 
	AbstractNode , 
	PrinterCache , 
	DefaultPrinterComponent , 
	DefaultEditorComponent , 
} from "@ftyyy/ytext"

class App extends React.Component<{} , {
	tree: AbstractNode
}>{
	editor_ref : React.RefObject<DefaultEditorComponent>

	printer: Printer
	editorcore: EditorCore
	constructor(props: any){
		super(props)

		let me = this

		// build printer
		this.printer = new Printer(
			[math] , 
			[theorem] , 
			{
				group: {
					"math": math_printer , 
				} , 
				structure: {} , inline: {} , support: {} , abstract: {} , 
			} , 
			default_renderers , 
		)

		// 建立编辑器核心。
		this.editorcore = new EditorCore({
			renderers: {
				group: {
					math: math_editor , 
				} , structure: {} , inline: {} , support: {} , abstract: {} , 
			} , 
			default_renderers: get_default_editors(), 
			printer: me.printer , 
		})
		

		this.state = {
			tree: this.editorcore.create_abstract("root")
		}

		this.editor_ref = React.createRef()
	}

	update_tree(){
		let editor = this.editor_ref.current
		if(!editor){
			return undefined
		}
		let root = editor.get_root()
		this.setState({tree: root as AbstractNode})
		return root
	}

	render(){
		let me = this
		return <div>
					
			<div style = {{position: "absolute", width: "48%", left: "1%", top: "1%", height: "98%"}}>
				<DefaultEditorComponent // editor component
					ref = {me.editor_ref}
					editorcore = {me.editorcore} // input editor core
					init_rootchildren = {me.state.tree.children} // This is the initialization of editor, the updates in the tree will not trigger rerendering
					onSave = {()=>{
						me.setState({tree: me.editor_ref.current.get_root() as AbstractNode})
						// save the tree to backend
                        // save(me.state.tree)
					}}
				/>
			</div>

			<div style = {{position: "absolute", width: "48%", left: "51%", top: "1%", height: "98%",}} >
					<DefaultPrinterComponent // printer component
						printer = {me.printer} // input printer core
						root = {me.state.tree} // The update of state.tree will trigger rerenderring of Printer
					></DefaultPrinterComponent>
			</div>
		</div>
	}
}
export default App
