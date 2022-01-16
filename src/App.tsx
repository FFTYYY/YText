import React from "react"
import Button from "@mui/material/Button"

import "./App.css"
import { YEditor } from "./editor/editor_interface"
import { StyledNode , NodeType , StyleType , GroupNode , group_prototype} from "./editor/core/elements"
import { new_default_group } from "./editor/components/groups"
import { new_default_iniline } from "./editor/components/inlines"
import { newparagraph } from "./editor/components/supports"
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
import {DefaultHidden} from "./editor/components/hidden"
import {DefaultParameterWithEditorWithDrawer} from "./editor/components/universe"
import {EditorCore , InlineStyle , GroupStyle , StructStyle , SupportStyle , AbstractStyle} from "./editor/core/editor_core"
import { DefaultEditor } from "./editor/components/editor"
import { OutRenderer } from "./editor/out_renderer"
import { Node } from "slate"

interface App_State{
	value: Node[]
}
class App extends React.Component<any,App_State> {
	editor: YEditor
	outputer: OutRenderer
	core: EditorCore
	
	constructor(props: any) {
		super(props)
		this.state = {
			value: []
		}

		let [theoremstyle, theoremrenderer] = new_default_group(
			"theorem" , 
			{title: "Theorem 1" , other_param: "xxx" , sub_par: {a: "1", b: "2"}}
		)
		let [strongstyle, strongrenderer] = new_default_iniline("strong" , {test: "haha"})
		let [npstyle , nprenderer] = newparagraph("newparagraph")

		this.core = new EditorCore(
			[strongstyle]      , 
			[theoremstyle]       , 
			[] , 
            [npstyle]     , 
            [new AbstractStyle("comment" , {}) , new AbstractStyle("comment 2" , {})]      , 
        )

		this.editor = new YEditor( this.core )
		this.editor.update_renderer(theoremrenderer , "group" , "theorem")
		this.editor.update_renderer(strongrenderer  , "inline" , "strong")
		this.editor.update_renderer(nprenderer , "support" , "newparagraph")
		
		this.outputer = new OutRenderer( this.core )

		this.setState( {value: this.core.root.children} )
	}

	render() {
		let me = this
		let OutputRenderer = this.outputer._Component.bind(this.outputer)
		let default_group = group_prototype("root" , {})
		return <div>
			<div 
				style={{
					position: "absolute" , 
					width: "50%" ,
					left: "0" , 
				}}
			>
				<DefaultEditor 
					editor = {me.editor}
					onUpdate={newval => {
						me.setState({value: newval})
					}}
				/>
			</div>

			<div 
				style={{
					position: "absolute" , 
					width: "50%" ,
					left: "50%" , 
					height: "100%" , 
					backgroundColor: "#AABBCC"
				}}
			>
				<OutputRenderer 
					element = {{...default_group , ...{children: me.state.value}}}
				/>
			</div>
		</div>
	}
}

export default App
