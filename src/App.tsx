import React from "react"
import Button from "@mui/material/Button"

import "./App.css"

import { 
	Box ,
} 
from "@mui/material"

import { Node , Transforms } from "slate"

import {
	YEditor , 
	EditorCore , 
	Printer , 
	
	GroupStyle , 
	AbstractStyle , 
	SupportStyle ,
	InlineStyle , 

	group_prototype ,
	paragraph_prototype , 

	DefaultEditor , 
	DefaultPrinter , 
	DefaultNewParagraph , 
	get_DefaultGroup_with_AppBar , 
	get_DefaultGroup_with_RightBar , 
	get_DefaultInline , 
	get_DefaultSplitter , 
	get_DefaultDisplayer ,
	DefaultParagraph , 

	get_DefaultListPrinter , 
	get_DefaultGroupPrinter , 
	get_DefaultParagraphPrinter , 

	OrderEffector , 
} from "../lib"

import type {
	PrinterRenderer , 
	GroupNode , 
	PrinterEnv , 
	PrinterContext , 
} 
from "../lib"

interface App_State{
	value: Node[]
}
class App extends React.Component<any,App_State> {
	editor : YEditor
	printer: Printer
	core: EditorCore
	
	constructor(props: any) {
		super(props)

		let theoremstyle = new GroupStyle("theorem" , {
			title: "Theorem" , 
			alias: "xxx" , 
			sub_par: {a: "1", b: "2"} , 
			haha: {
				a: 123,
				b: 0.99 , 
				c: false , 
			}
		})
		let liststyle = new GroupStyle("list" , {title: "list"})
		let prooftyle = new GroupStyle("proof" , {title: "Proof"})
		let theoremrenderer = get_DefaultGroup_with_AppBar()
		let listrenderer    = get_DefaultGroup_with_RightBar()
		let proofrenderer = get_DefaultGroup_with_RightBar()

		let strongstyle = new InlineStyle("strong" , {test: "2333"})
		let strongrenderer = get_DefaultInline()

		let npstyle = new SupportStyle("newparagraph" , {})
		let sectionerstyle = new SupportStyle("new-section" , {alias: ""})
		let imagestyle = new SupportStyle("image" , {url: "" , title: ""})
		let nprenderer = DefaultNewParagraph
		let sectrionrenderer = get_DefaultSplitter((parameters)=>parameters.alias)
		let imagerenderer = get_DefaultDisplayer((parameters)=>parameters.url)

		this.core = new EditorCore([
				...[strongstyle]      , 
				...[theoremstyle , liststyle , prooftyle]       , 
				...[] , 
				...[imagestyle , npstyle , sectionerstyle]     , 
				...[new AbstractStyle("comment" , {}) , new AbstractStyle("comment 2" , {})]
			] , 
			{test: "haha"} , 
        )

		this.editor = new YEditor( this.core )
		this.editor.update_renderer(DefaultParagraph , "paragraph")
		this.editor.update_renderer(theoremrenderer , "group" , "theorem")
		this.editor.update_renderer(strongrenderer  , "inline" , "strong")
		this.editor.update_renderer(nprenderer , "support" , "newparagraph")
		this.editor.update_renderer(sectrionrenderer , "support" , "new-section")
		this.editor.update_renderer(imagerenderer , "support" , "image")
		this.editor.update_renderer(listrenderer , "group" , "list")
		this.editor.update_renderer(proofrenderer , "group" , "proof")
		
		this.printer = new Printer( this.core )
		
		let listprinter = get_DefaultListPrinter()
		let _theo_order = new OrderEffector("order/theo" , "order/theo")
		let theoremprinter = get_DefaultGroupPrinter(
			[_theo_order] , 
			(props: {element: GroupNode, env: PrinterEnv , context: PrinterContext}) => {
				let order = _theo_order.get_context(props.context)
				return <span>{props.element.parameters.title} {order}: </span>
			}
		)
		let proofprinter = get_DefaultGroupPrinter(
			[] , 
			(props: {element: GroupNode, env: PrinterEnv , context: PrinterContext}) => {
				return <span>{props.element.parameters.title}: </span>
			} , 
			(props)=><></>,
			(props)=><></>,
			(props:{element: GroupNode, context: PrinterContext}) => {
				return <div>Q.E.D</div>
			}

		)


		let paragraphprinter = get_DefaultParagraphPrinter()

		this.printer.update_renderer( paragraphprinter, "paragraph" )
		this.printer.update_renderer( listprinter as PrinterRenderer, "group" , "list" )
		this.printer.update_renderer( theoremprinter as PrinterRenderer, "group" , "theorem" )
		this.printer.update_renderer( proofprinter as PrinterRenderer, "group" , "proof" )
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
					onUpdate = {(newval)=>{
						// console.log(me.editor.core.root)
					}}
				/>
			</Box>

			<Box sx = {{
					position: "absolute" , 
					width: "48%" ,
					left: "52%" , 
					height: "90%" , 
					backgroundColor: "#AABBCC" , 
					overflow: "auto" , 
			}}>
				<DefaultPrinter
					printer = {this.printer}
				/>
			</Box>
		</Box>
	}
}

export default App
