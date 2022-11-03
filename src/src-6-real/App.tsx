import React , { useState } from "react"

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
	RendererDict , 
	DefaultRendererhDict , 
} from "../../lib"

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
import { linkto } from "./base/linkto"
import { my_theme } from "./uibase"
import { SaveButton} from "./buttons"
import { withAllPlugins } from "./plugins"
import { FileManageButton , UploadFileButton } from "./buttons/manage_files"
import { BackendEdit , NodeStructEdit , NodeStructEditShallow , NodeView} from "./buttons/edit_others"
import { parse_second_concepts } from "./base/utils"
import { MathJaxContext } from "./base/construction"
import CssBaseline from '@mui/material/CssBaseline';
import {get_root, get_ccpt} from "./base/get_concept_and_root/get_root_and_sec_ccpt"

let default_tree = {
	type: "abstract" as "abstract" ,
	concept: "root" , 
	idx: 2333 , 
	abstract: [] , 
	parameters: {} , 
	children: [{children: [{text: "fuck"}]}] , 
}

// TODO 整理按钮栏
// TODO 在保存后还原焦点
class App extends  React.Component<{}, {
	flags?: number

	printer: Printer  | undefined
	editorcore: EditorCore | undefined
	tree: AbstractNode 

}>{

	editor_ref: React.RefObject<DefaultEditorComponent>
	savebutton_ref: React.RefObject<SaveButton>

	constructor(props: {}){
		super(props)

		this.state = {		
			printer: undefined , 
			editorcore: undefined , 
			tree: {...default_tree} , 
		}
		this.savebutton_ref = React.createRef()
		this.editor_ref = React.createRef()
	}

	async componentDidMount(){

		// 从后端获得所有概念。
		let sec_concepts_data = get_ccpt()
		let sec_concepts = parse_second_concepts(sec_concepts_data)

		// 建立印刷器核心
		let printer = new Printer(
			first_concepts , 
			sec_concepts , 
			renderers as RendererDict, 
			default_renderers as DefaultRendererhDict, 
		)
		
		// 建立编辑器核心
		let editorcore = new EditorCore({
			renderers: editors , 
			default_renderers: default_editors, 
			printer: printer , 
		})
		
		// 初始化编辑器初始值。
		var root = get_root() as AbstractNode 

		this.setState({
			printer: printer , 
			editorcore: editorcore , 
			tree: {...root} , 
		})


		// 初始化跳转
	}

	/** 获得编辑器对象。 */
	get_editor(){
		if(this.editor_ref && this.editor_ref.current){
			return this.editor_ref.current
		}
		return undefined
	}

	/** 这个函数将编辑器的树保存到后端。 
	 * @param tree 要保存的树。之所以有这个参数是因为state的更新有延迟，这个参数可以允许调用者直接传入最新的版本。
	*/
	async save_content(tree: AbstractNode | undefined = undefined){
		if(tree == undefined){
			tree = this.state.tree
		}
		return true
	}

	/** 这个函数向后端提交一个文件。 */


	update_tree(){
		let editor = this.get_editor()
		if(!editor){
			return 
		}
		let edieditor = editor.get_editor()
		if(!edieditor){
			return 
		}
		let root = edieditor.get_root()
		this.setState({tree: root})
		return root
	}

	mainpart(props: {sx: any}){
		let me = this

		if(!(this.state.editorcore && this.state.printer)){
			return <></>
		}
		let {editorcore, printer, tree} = this.state
 
		return <Box sx={props.sx}>
			<Box sx = {{
				position: "absolute" , 
				width: "49%" ,
				left: "0%" , 
				top: "0" , 
				height: "100%" , 
			}} className = "mathjax_ignore">
				<DefaultEditorComponent
					ref = {me.editor_ref}
					editorcore = {editorcore}
					init_rootchildren = {tree.children}
					onSave = {()=>{
						let root = me.update_tree()
						setTimeout(()=>me.save_content(root), 200) // 等待state更新
					}}
					theme = {my_theme}
					plugin = { withAllPlugins }
				/>
			</Box>

			<MathJaxContext><ScrollBarBox 
				sx = {{
					position: "absolute" , 
					width: "49%" ,
					left: "51%" , 
					top: "0" , 
					height: "100%" , 
				}} 
				className = "mathjax_process" // 启动mathjax处理
			>
				<GlobalInfoProvider value={{}}>
					<DefaultPrinterComponent 
						printer = {printer} 
						theme = {my_theme}
						onUpdateCache = {(cache)=>{console.log("cache!")}}
						root = {tree}
					></DefaultPrinterComponent>
				</GlobalInfoProvider>
			</ScrollBarBox></MathJaxContext>
		</Box>
	}

	render(){
		let me = this
		let MainPart = this.mainpart.bind(this)

		return <ThemeProvider theme={createTheme(my_theme)}><CssBaseline /><Box sx={{
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
				<SaveButton 
					ref = {me.savebutton_ref}
					save_func = {me.save_content.bind(me)}
				/>
				<FileManageButton />
				<UploadFileButton />
				<BackendEdit /> 
				<NodeStructEdit /> 
				<NodeStructEditShallow /> 
				<NodeView />
			</Card>

			<MainPart sx={{
				position: "absolute" , 
				left: "3%" , 
				width: "96%" , 
				height: "100%" , 
			}}/>
			
		</Box></ThemeProvider>
	}

}

export default App


