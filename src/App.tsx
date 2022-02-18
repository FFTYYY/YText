import React from "react"
import Button from "@mui/material/Button"

import { 
	Box ,
} 
from "@mui/material"

import { Node , Transforms } from "slate"
import { createTheme, ThemeProvider, styled } from "@mui/material/styles"

import {
	YEditor , 
	EditorCore , 
	Printer , 
	

	group_prototype ,
	paragraph_prototype , 

	DefaultEditor , 
	DefaultPrinter , 

	default_theme , 
} from "../lib"

import type {
	PrinterRenderer , 
	GroupNode , 
	PrinterEnv , 
	PrinterContext ,
	 
} 
from "../lib"

import { get_all_styles } from "./components/styles"
import { use_all_editors } from "./components/editors"
import { use_all_printers } from "./components/printers"
import { my_theme } from "./components/theme"

interface App_State{
	value: Node[]
}
class App extends React.Component<any,App_State> {
	editor : YEditor
	printer: Printer
	core: EditorCore
	
	constructor(props: any) {
		super(props)


		this.core = new EditorCore(
			get_all_styles() , 
			{test: "haha"} , 
        )

		this.editor = new YEditor( this.core )
		this.editor = use_all_editors( this.editor )
		
		this.printer = new Printer( this.core )
		this.printer = use_all_printers(this.printer)
		
	}

	outer_act(){
		Transforms.insertNodes( this.editor.slate , [paragraph_prototype("桀桀") , paragraph_prototype("!!")] )
	}

	render() {
		let me = this

		return <Box>
			<Button onClick={me.outer_act.bind(this)}>Outer_Edit</Button>
			<Box sx = {{
				position: "absolute" , 
				width: "48%" ,
				left: "1%" , 
				height: "90%" , 
			}}>
				<DefaultEditor 
					editor = {me.editor}
					theme = {my_theme}
				/>
			</Box>

			<Box sx = {{
					position: "absolute" , 
					width: "48%" ,
					left: "51%" , 
					height: "90%" , 
					overflow: "auto" , 
			}}>
				<DefaultPrinter
					printer = {this.printer}
					theme = {my_theme}
				/>
			</Box>
		</Box>
	}
}

export default App
