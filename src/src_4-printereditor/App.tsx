/** 这一个src是为了测试能否将之前的格式转成新的格式。 */

import React from "react"
import {
	Printer ,
	PrinterComponent ,
	FirstClassConcept , 
	SecondClassConcept ,  
	PrinterBackgroundPaper , 
	RendererDict, 
	DefaultRendererhDict, 

	DefaultPrinterComponent , 

	EditorCore,
	EditorComponent , 
	default_editor_theme , 
} from "../../libprinter"
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

class App extends React.Component<{},{}>{
	constructor(props: {}){
		super(props)
	}

	render(){
		let me = this
		return <div>
			 <ThemeProvider theme = {createTheme(default_editor_theme)}>
				<div style = {{position: "absolute", width: "50%", backgroundColor: "rgb(123,244,254)"}}>
					<EditorComponent
						editorcore = {editorcore}
						init_rootchildren = {tree.children}
					/>
				</div>
			</ThemeProvider>
			<div style = {{position: "absolute", width: "50%", left: "50%", backgroundColor: "rgb(233,244,254)"}}>
				<DefaultPrinterComponent 
					printer = {printer} 
					root = {tree}
					theme = {my_theme}
				></DefaultPrinterComponent>
			</div>

		</div>
	}
}

export default App