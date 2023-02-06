import React , { useState } from "react"
import {
	EditorComponent , 
	ConceptNode , 
	Node , 
	AbstractNode , 
	GroupNode , 
	EditorCore , 
	AutoStack , 
	AutoIconButton , 
	PrinterRenderer , 
	set_normalize_status , 
	Printer , 
	SecondClassConcept , 

	DefaultEditorComponent , 
	DefaultPrinterComponent , 

	GlobalInfoProvider, 
	SecondClassConceptDict, 
	ScrollBarBox , 
	PrinterCache, 
	RendererDict,
	DefaultRendererhDict,
	EditorDefaultRendererhDict, 
	EditorRendererDict , 
} from "../../../lib"

import {
	Drawer , 
	Fab , 
	Box , 
	Grid , 
	Button , 
	Stack , 
	Paper , 
	Divider , 
	Container, 
	Typography, 
	Card , 
} from "@mui/material"

import {
	DriveFolderUpload as DriveFolderUploadIcon
} from "@mui/icons-material"


import * as Slate from "slate"
import * as SlateReact from "slate-react"

import { createTheme, ThemeProvider, styled } from "@mui/material/styles"

import { 
	renderers , 
	default_renderers , 
	editors , 
	default_editors , 
	first_concepts , 
} from "./base/concept"
import { my_theme } from "./uibase"
import { withAllPlugins } from "./plugins"
import { parse_second_concepts } from "./base/utils"
import { MathJaxContext } from "./base/construction"
import CssBaseline from "@mui/material/CssBaseline"
import { SnackbarProvider  } from "notistack"
import "overlayscrollbars/overlayscrollbars.css"
import { OverlayScrollbars } from "overlayscrollbars"
import { flush_mathjax } from "./base/construction/math"
import { get_root, get_ccpt } from "./base/get_concept_and_root/get_root_and_sec_ccpt"

class App extends  React.Component<{}, {
	printer: Printer  | undefined
	editorcore: EditorCore | undefined
	tree: AbstractNode  | undefined
	cache: PrinterCache | undefined
}>{

	editor_ref: React.RefObject<DefaultEditorComponent>
	printer_ref: React.RefObject<DefaultPrinterComponent>
	snackerbar_ref: React.RefObject<SnackbarProvider>

	constructor(props: {}){
		super(props)

		this.state = {		
			printer: undefined , 
			editorcore: undefined , 
			tree: undefined , 
			cache: undefined , 
		}
		this.editor_ref = React.createRef()
		this.printer_ref = React.createRef()
		this.snackerbar_ref = React.createRef()
	}

	open_snackerbar(message: string){
		if(this.snackerbar_ref && this.snackerbar_ref.current){
			this.snackerbar_ref.current.enqueueSnackbar(message)
		}
	}

	
	componentDidMount(){
		let me = this

		// 从后端获得所有概念。
		let sec_concepts_data = get_ccpt()
		let sec_concepts = parse_second_concepts(sec_concepts_data)

		// 建立印刷器核心。
		let printer = new Printer(
			first_concepts , 
			sec_concepts , 
			renderers as RendererDict, 
			default_renderers as DefaultRendererhDict, 
		)
		
		// 建立编辑器核心。
		let editorcore = new EditorCore({
			renderers: editors as EditorRendererDict , 
			default_renderers: default_editors as EditorDefaultRendererhDict, 
			printer: printer , 
		})

		// 获得树。
		let root = get_root() as AbstractNode
		// let root = editorcore.create_abstract("root")

		// 获得缓存内容（其实是不必要的...）
		let cache = {}

		this.setState({
			printer: printer , 
			editorcore: editorcore , 
			tree: root , 
			cache: cache , 
		})
	}

	/** 获得编辑器对象。 */
	get_editor(){
		if(this.editor_ref && this.editor_ref.current){
			return this.editor_ref.current.get_editor()
		}
		return undefined
	}
	/** 获得印刷器对象。 */
	get_printer_comp(){
		if(this.printer_ref && this.printer_ref.current){
			return this.printer_ref.current.get_component()
		}
		return undefined
	}

	/** 这个函数将编辑器的树保存到后端。 
	 * @param tree 要保存的树。之所以有这个参数是因为state的更新有延迟，这个参数可以允许调用者直接传入最新的版本。
	*/
	async save_content(tree: AbstractNode | undefined = undefined, cache: PrinterCache | undefined = undefined){
		console.log(JSON.stringify(tree))
		this.open_snackerbar("Save Sucess (no)")
	}

	/** 这个函数让printer自动滚动到正在编辑的地方。 */
	scroll_to_selection(){
		let editor = this.get_editor()
		let printer_comp = this.get_printer_comp()
		if(!(editor && printer_comp)){
			return 
		}
		let selection = editor.get_slate().selection
		if(!(selection && selection.focus && selection.focus.path)){
			return 
		}
		let tar_path = selection.focus.path
		printer_comp.scroll_to(tar_path)
	}

	update_tree(){
		let editor = this.get_editor()
		if(!editor){
			return 
		}
		let root = editor.get_root()
		this.setState({tree: root})
		
		return root
	}

	render(){
		let me = this
		let {editorcore, printer, tree} = this.state

		if(!(editorcore && printer && tree)){
			return <></>
		} // 务必等一切都初始化好再开始渲染。

		let [tree_property, tree_children] = (()=>{
			let {children , ...tree_property} = tree
			return [tree_property , children]
		})()

		return <ThemeProvider theme={createTheme(my_theme)}><Box sx={(theme)=>({
			position: "fixed" , 
			width: "100%" , 
			height: "100%" , 
			left: "0" , 
			right: "0" , 
			backgroundColor: theme.palette.background.default , 
			color: theme.palette.text.primary , 
			class: "mathjax_ignore" , 
		})}><CssBaseline /><SnackbarProvider 
				maxSnack = {3} 
				ref = {me.snackerbar_ref}
				anchorOrigin = {{horizontal: "right" , vertical: "top"}}
				variant = {"info"}
			>
			<Box sx={{
				position: "absolute" , 
				top: "2%" ,
				left: "1%" , 
				height: "96%" , 
				width: "98%" , 
			}}>
				<Card sx={{
					position: "absolute" , 
					left: "0" , 
					width: "2%" ,
				}}>
				</Card>

				<Box sx={{
					position: "absolute" , 
					left: "3%" , 
					width: "96%" , 
					height: "100%" , 
				}}>
					<Box sx = {{
						position: "absolute" , 
						width: "49%" ,
						left: "0%" , 
						top: "0" , 
						height: "100%" , 
					}}>
						<DefaultEditorComponent
							ref = {me.editor_ref}
							editorcore = {editorcore}
							init_rootproperty = {tree_property}
							init_rootchildren = {tree_children} // 编辑器会记住第一次看到的树，所以务必在树初始化之后再渲染编辑器
							onSave = {()=>{
								let root = me.update_tree()
								setTimeout(()=>{
									flush_mathjax()
									me.save_content(root)
									me.scroll_to_selection()
								}, 50) // 等待state更新
							}}
							theme = {my_theme as any}
							plugin = { withAllPlugins }
						/>
					</Box>

					<ScrollBarBox 
						sx = {{
							position: "absolute" , 
							width: "49%" ,
							left: "51%" , 
							top: "0" , 
							height: "100%" , 
							overflow: "auto" , 
							paddingRight: "1%" , 

						}} 
						className = "mathjax_process" // 启动mathjax处理
					><MathJaxContext>
						<GlobalInfoProvider value={{
							BackendData: {} , 
							cache: me.state.cache , 
						}}>
							<DefaultPrinterComponent 
								printer = {printer} 
								theme = {my_theme as any}
								onUpdateCache = {(cache)=>{
									if(cache && JSON.stringify(cache) != JSON.stringify(me.state.cache)){
										// XXX 这里会报warning，这是因为printer里在render()里调用了这个函数...
										setTimeout(()=>me.setState({cache: cache}) , 200)
									}
								}}
								ref = {me.printer_ref}
								root = {tree}
							></DefaultPrinterComponent>
						</GlobalInfoProvider>
					</MathJaxContext></ScrollBarBox>
				</Box>
				
			</Box>
		</SnackbarProvider></Box></ThemeProvider>
	}

}

export default App

