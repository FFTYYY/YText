import React from "react"
import {
	Printer ,
	PrinterComponent ,
	FirstClassConcept , 
	SecondClassConcept ,  
	default_theme , 
	PrinterBackgroundPaper , 
} from "../lib"
import {
	theorem , 
	strong , 
	sec_theorem , 
	sec_strong , 
} from "./concepts"
import {
	renderer_strong , 
	renderer_theorem , 
	default_renderers , 
} from "./renderers"
import {
	tree
} from "./tree"
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

let printer = new Printer(
	[theorem , strong] , 
	[sec_theorem , sec_strong] , 
	{
		"group": {
			"theorem": renderer_theorem , 
		} , 
		"inline": {
			"strong": renderer_strong , 
		} , 
		"struct": {} , "support" : {} , "abstract": {} , 
	} , 
	default_renderers , 
)

class App extends React.Component<{},{}>{
	constructor(props: {}){
		super(props)
	}

	render(){
		let me = this
		return <ThemeProvider theme = {createTheme(default_theme)}>
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