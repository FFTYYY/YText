/** 这一个src是为了测试能否将之前的格式转成新的格式。 */

import React from "react"

import {
	IconButton ,
} from "@mui/material"
import {
    ArrowRightAlt  as ArrowRightAltIcon  , 
}
from "@mui/icons-material"

import {
	Printer ,
	PrinterComponent ,
	FirstClassConcept , 
	GroupNode , 
	SecondClassConcept ,  
	PrinterBackgroundPaper , 
	RendererDict, 
	DefaultRendererhDict, 
	AbstractNode , 
	EditorRenderer , 

	DefaultPrinterComponent , 
	EditorRendererDict , 
	EditorDefaultRendererhDict , 

	EditorCore,
	EditorComponent , 
	default_editor_theme, 
	GlobalInfo, 

	DefaultEditorComponent, 
	PrinterCache, 
} from "../../lib"
import {
	first_concepts , 
} from "./first_concepts"
import {
	renderers , 
	default_renderers , 
} from "./print_renderers"
import {
    editors , 
    default_editors , 
} from "./editor_renderers"
import {
	get_tree , 
	get_second_concepts , 
} from "./data"
import {my_theme} from "./theme"

let tree = get_tree()
let printer = new Printer(
	first_concepts , 
	get_second_concepts() , 
	renderers as RendererDict , 
	default_renderers as DefaultRendererhDict , 
)

let editorcore = new EditorCore({
	renderers: editors , 
	default_renderers: default_editors, 
	printer: printer , 
})

class App extends React.Component<{},{
	tree: AbstractNode 
}>{
	editor_ref: React.RefObject<DefaultEditorComponent>
	constructor(props: {}){
		super(props)

		this.state = {
			tree: {
				type: "abstract" ,
				concept: "root" , 
				idx: 2333 , 
				abstract: [] , 
				parameters: {} , 
				children: [] , 
			}
		}

		this.editor_ref = React.createRef<DefaultEditorComponent>()
	}
	componentDidMount(): void {
		this.update()
	}
	update(){
		let me = this
		if(!me.editor_ref || !me.editor_ref.current){
			return
		}
		let editor = me.editor_ref.current
		let edieditor = editor.get_editor()
		if(edieditor){
			this.setState({tree: edieditor.get_root()})
		}
	}
	update_cache(new_cache: PrinterCache){
		// console.log(new_cache)
	}
	render(){
		let me = this

		return <div>
			<div style = {{position: "absolute", width: "50%", height: "100%", backgroundColor: "rgb(123,244,254)"}}>
				<DefaultEditorComponent
					editorcore = {editorcore}
					init_rootchildren = {tree.children}
					ref = {me.editor_ref}
					onSave = {()=>{
						me.update()
					}}
				/>
			</div>
			<pre>{JSON.stringify(this.state.tree)}</pre>
			<div style = {{position: "absolute", width: "50%", left: "50%", backgroundColor: "rgb(233,244,254)"}}>
				<DefaultPrinterComponent 
					printer = {printer} 
					root = {this.state.tree}
					theme = {my_theme}
					onUpdateCache = {(cache)=>{this.update_cache(cache)}}
				></DefaultPrinterComponent>
			</div>

		</div>
	}
}

export default App