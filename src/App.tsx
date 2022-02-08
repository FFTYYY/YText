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
import {YEditor , EditorCore , OutRenderer , AbstractStyle , new_default_group , new_default_iniline , newparagraph , new_displayer} from "../lib"
import {group_prototype , DefaultEditor , paragraph_prototype , new_splitter , OutRenderer_Props} from "../lib"

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

		let [theoremstyle, theoremrenderer] = new_default_group(
			"theorem" , 
			{title: "Theorem 1" , other_param: "xxx" , sub_par: {a: "1", b: "2"}}
		)
		let [strongstyle, strongrenderer] = new_default_iniline("strong" , {test: "haha"})
		let [npstyle , nprenderer] = newparagraph("newparagraph")
		let [sectionerstyle , sectrionrenderer] = new_splitter("new-section" , {alias: ""})
		let [imagestyle , imagerenderer] = new_displayer("image" , {url: "" , title: ""})

		this.core = new EditorCore(
			[strongstyle]      , 
			[theoremstyle]       , 
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
		
		this.outputer = new OutRenderer( this.core )
		this.outputer.update_renderer( sectrionrenderer, "support" , "new-section" )
	}

	extra_button(){
		Transforms.insertNodes( this.editor.slate , [paragraph_prototype("桀桀") , paragraph_prototype("!!")] )
	}

	render() {
		let me = this
		let default_group = group_prototype("root" , {})
		return <div>
			<Button onClick={me.extra_button.bind(this)}>Extra_Edit</Button>
			<div 
				style = {{
					position: "absolute" , 
					width: "50%" ,
					left: "0" , 
				}}
			>
				<DefaultEditor 
					editor = {me.editor}
					onUpdate = {(newval)=>{
						console.log(me.editor.core.root)
					}}
				/>
			</div>

			<div 
				style = {{
					position: "absolute" , 
					width: "50%" ,
					left: "50%" , 
					height: "100%" , 
					backgroundColor: "#AABBCC"
				}}
			>
				<OutRenderer.Component
					renderer = {this.outputer}
				/>
			</div>
		</div>
	}
}

export default App
