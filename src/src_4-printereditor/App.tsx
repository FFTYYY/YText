/** 这一个src是为了测试能否将之前的格式转成新的格式。 */

import React from "react"
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

	DefaultPrinterComponent , 

	EditorCore,
	EditorComponent , 
	default_editor_theme, 
	GlobalInfo, 

	DefaultEditorComponent ,
	
	ScrollBarBox , 
} from "../../lib"
import {
	first_concepts , 
	second_concepts , 
} from "./concepts"
import {
	renderers , 
	default_renderers , 
} from "./renderers"
import {
	renderers as editor_renderers , 
	default_renderers as editor_default_renderers , 
} from "./editorrenderers"
import {
	tree
} from "./tree"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import type { ThemeOptions } from "@mui/material/styles"
import {my_theme} from "./theme"

let printer = new Printer(
	first_concepts , 
	second_concepts , 
	renderers as RendererDict , 
	default_renderers as DefaultRendererhDict , 
)

let editorcore = new EditorCore({
	renderers: editor_renderers , 
	default_renderers: editor_default_renderers , 
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
		console.log(tree)
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
	render(){
		let me = this

		return <div>
			<div style = {{position: "absolute", top: "1%" , width: "50%", height: "98%", backgroundColor: "rgb(123,244,254)"}}>
				<DefaultEditorComponent
					editorcore = {editorcore}
					init_rootchildren = {tree.children}
					ref = {me.editor_ref}
					onSave = {()=>{
						me.update()
					}}
				/>
			</div>
			<ScrollBarBox style = {{position: "absolute", width: "50%", left: "50%", top: "1%" , height: "98%", backgroundColor: "rgb(233,244,254)"}}>
				<DefaultPrinterComponent 
					printer = {printer} 
					root = {this.state.tree}
					theme = {my_theme}
				></DefaultPrinterComponent>
			</ScrollBarBox>

		</div>
	}
}

export default App