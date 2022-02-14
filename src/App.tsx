import React from "react"
import Button from "@mui/material/Button"

import "./App.css"

import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import ButtonGroup from '@mui/material/ButtonGroup';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import SettingsIcon from '@mui/icons-material/Settings';
import Switch from '@mui/material/Switch';
import {YEditor , EditorCore , OutRenderer , AbstractStyle , newparagraph , new_displayer} from "../lib"
import { get_DefaultGroup_with_AppBar , GroupStyle , get_DefaultGroup_with_RightBar} from "../lib"
import {group_prototype , DefaultEditor , paragraph_prototype , new_splitter , OutRenderer_Props} from "../lib"
import { InlineStyle , get_DefaultInline , DefaultRenderer , list_out_renderer} from "../lib"

import { Node , Transforms } from "slate"
interface App_State{
	value: Node[]
}
class App extends React.Component<any,App_State> {
	editor: YEditor
	outputer: OutRenderer
	core: EditorCore
	
	constructor(props: any) {
		super(props)

		let theoremstyle = new GroupStyle("theorem" , {
			title: "Theorem 1" , 
			other_param: "xxx" , 
			sub_par: {a: "1", b: "2"} , 
			haha: {
				a: 123,
				b: 0.99 , 
				c: false , 
			}
		})
		let liststyle = new GroupStyle("list" , {title: "list"})
		let theoremrenderer = get_DefaultGroup_with_AppBar()
		let listrenderer    = get_DefaultGroup_with_RightBar()

		let strongstyle = new InlineStyle("strong" , {test: "2333"})
		let strongrenderer = get_DefaultInline()

		let [npstyle , nprenderer] = newparagraph("newparagraph")
		let [sectionerstyle , sectrionrenderer] = new_splitter("new-section" , {alias: ""})
		let [imagestyle , imagerenderer] = new_displayer("image" , {url: "" , title: ""})

		this.core = new EditorCore(
			[strongstyle]      , 
			[theoremstyle , liststyle]       , 
			[] , 
            [imagestyle , npstyle , sectionerstyle]     , 
            [new AbstractStyle("comment" , {}) , new AbstractStyle("comment 2" , {})]      , 
			{test: "haha"} , 
        )

		this.editor = new YEditor( this.core )
		this.editor.update_renderer(theoremrenderer , "group" , "theorem")
		this.editor.update_renderer(strongrenderer  , "inline" , "strong")
		this.editor.update_renderer(nprenderer , "support" , "newparagraph")
		this.editor.update_renderer(sectrionrenderer , "support" , "new-section")
		this.editor.update_renderer(imagerenderer , "support" , "image")
		this.editor.update_renderer(listrenderer , "group" , "list")
		
		this.outputer = new OutRenderer( this.core )
		// this.outputer.update_renderer( sectrionrenderer, "support" , "new-section" )
		this.outputer.update_renderer( list_out_renderer, "group" , "list" )
	}

	extra_button(){
		Transforms.insertNodes( this.editor.slate , [paragraph_prototype("桀桀") , paragraph_prototype("!!")] )
	}

	render() {
		let me = this
		let default_group = group_prototype("root" , {})
		return <Box>
			<Button onClick={me.extra_button.bind(this)}>Extra_Edit</Button>
			<Box sx = {{
				position: "absolute" , 
				width: "49%" ,
				left: "0" , 
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
					width: "49%" ,
					left: "51%" , 
					height: "90%" , 
					backgroundColor: "#AABBCC" , 
					overflow: "auto" , 
			}}>
				<DefaultRenderer
					outer = {this.outputer}
				/>
			</Box>
		</Box>
	}
}

export default App
