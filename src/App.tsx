import React from "react"
import {
	Printer ,
	PrinterComponent ,
	FirstClassConcept , 
	SecondClassConcept ,  
	PrinterBackgroundPaper , 
	RendererhDict, 
	DefaultRendererhDict, 
} from "../lib"
import {
	first_concepts
} from "./first_concepts"
import {
	second_concepts
} from "./second_concepts"
import {
	renderers , 
	default_renderers , 
} from "./renderers"
import {
	tree
} from "./tree"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"
import type { ThemeOptions } from "@mui/material/styles"
import {theme} from "./theme"

let printer = new Printer(
	first_concepts , 
	second_concepts , 
	renderers as RendererhDict , 
	default_renderers as DefaultRendererhDict , 
)

class App extends React.Component<{},{}>{
	constructor(props: {}){
		super(props)
	}

	render(){
		let me = this
		return <ThemeProvider theme = {createTheme(theme)}>
			<PrinterBackgroundPaper>
				<PrinterComponent 
					printer = {printer} 
					root = {tree}
				></PrinterComponent>
			</PrinterBackgroundPaper>
		</ThemeProvider>
	}
}

export default App